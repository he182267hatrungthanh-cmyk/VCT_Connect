# ==========================================
# Stage 1: Build Frontend (Next.js Standalone)
# ==========================================
FROM node:22-alpine AS frontend-builder
WORKDIR /app

# Copy package manifests for workspace caching
COPY frontend/package.json frontend/package-lock.json ./
COPY frontend/apps/web/package.json apps/web/package.json
COPY frontend/apps/extension/package.json apps/extension/package.json
COPY frontend/packages/contracts/package.json packages/contracts/package.json
COPY frontend/packages/api-client/package.json packages/api-client/package.json

RUN npm ci

# Copy frontend source code
COPY frontend/ ./

# Build arguments for Clerk & extension origin
ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ARG VCT_EXTENSION_WEB_ORIGIN
ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ENV VCT_EXTENSION_WEB_ORIGIN=$VCT_EXTENSION_WEB_ORIGIN

# Build standalone Next.js web application
RUN npm run build -w @vct/web

# ==========================================
# Stage 2: All-in-One Runtime (Python 3.12 + Node.js 22)
# ==========================================
FROM python:3.12-slim AS runtime

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PLAYWRIGHT_BROWSERS_PATH=/opt/playwright \
    NODE_ENV=production \
    PORT=10000 \
    HOSTNAME=0.0.0.0 \
    PYTHONPATH=/app

WORKDIR /app

# 1. Install Node.js 22 and curl for Next.js runtime
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    ca-certificates \
    gnupg \
    && curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
    && apt-get install -y --no-install-recommends nodejs \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# 2. Install Python dependencies and Playwright Chromium
COPY backend/requirements.txt /app/backend/requirements.txt
RUN pip install --no-cache-dir -r /app/backend/requirements.txt \
    && python -m playwright install --with-deps --only-shell chromium \
    && chmod -R a+rX /opt/playwright \
    && rm -rf /var/lib/apt/lists/*

# 3. Create non-root user
RUN useradd --create-home --uid 10001 vct

# 4. Copy Backend application code
COPY --chown=vct:vct backend /app/backend

# 5. Copy Frontend Standalone artifacts from builder
COPY --from=frontend-builder --chown=vct:vct /app/apps/web/.next/standalone /app/frontend
COPY --from=frontend-builder --chown=vct:vct /app/apps/web/.next/static /app/frontend/apps/web/.next/static
COPY --from=frontend-builder --chown=vct:vct /app/apps/web/public /app/frontend/apps/web/public
COPY --from=frontend-builder --chown=vct:vct /app/apps/web/private/vct-connect-extension.zip /app/frontend/apps/web/private/vct-connect-extension.zip

# 6. Copy and configure startup script
COPY --chown=vct:vct scripts/start-render.sh /app/start.sh
RUN chmod +x /app/start.sh

USER vct

EXPOSE 10000

CMD ["/app/start.sh"]
