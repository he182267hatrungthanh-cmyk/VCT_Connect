#!/bin/bash

# Configuration and environment defaults for Render
export QUEUE_TRANSPORT="${QUEUE_TRANSPORT:-local}"
export DEVELOPER_MODE="${DEVELOPER_MODE:-true}"
export API_RUNTIME="${API_RUNTIME:-local}"
export API_INTERNAL_ORIGIN="${API_INTERNAL_ORIGIN:-http://127.0.0.1:8000}"
export HOSTNAME="${HOSTNAME:-0.0.0.0}"
export PORT="${PORT:-10000}"
export PYTHONPATH="/app:${PYTHONPATH:-}"

echo "=================================================="
echo "  VCT Connect - All-in-One Service on Render"
echo "  Port: $PORT | Queue: $QUEUE_TRANSPORT | Mode: $DEVELOPER_MODE"
echo "=================================================="

# Track child PIDs
FASTAPI_PID=""
WORKER_PID=""
FRONTEND_PID=""

# Graceful cleanup on termination signal
cleanup() {
    echo ""
    echo "Caught termination signal. Shutting down services..."
    [ -n "$FRONTEND_PID" ] && kill -TERM "$FRONTEND_PID" 2>/dev/null || true
    [ -n "$FASTAPI_PID" ] && kill -TERM "$FASTAPI_PID" 2>/dev/null || true
    [ -n "$WORKER_PID" ] && kill -TERM "$WORKER_PID" 2>/dev/null || true
    wait "$FRONTEND_PID" "$FASTAPI_PID" "$WORKER_PID" 2>/dev/null || true
    echo "Services stopped cleanly."
    exit 0
}
trap cleanup SIGTERM SIGINT

# 1. Wait for PostgreSQL and run migrations
if [ -n "$DATABASE_URL" ]; then
    echo "Checking PostgreSQL connection..."
    for i in $(seq 1 15); do
        if python -c "import os, psycopg; conn = psycopg.connect(os.environ['DATABASE_URL'], connect_timeout=3); conn.close()" 2>/dev/null; then
            echo "PostgreSQL is reachable."
            break
        fi
        echo "Waiting for PostgreSQL ($i/15)..."
        sleep 2
    done

    echo "Running database initialization and migrations..."
    if python -m backend.app.init_db; then
        echo "Database schema migrated successfully."
    else
        echo "Warning: init_db encountered an issue or database already initialized. Continuing..."
    fi
else
    echo "Warning: DATABASE_URL is not set! Analysis queue and user auth will not function without a database."
fi

# 2. Start Background Worker
echo "Starting VCT analysis worker..."
python -m backend.worker.main &
WORKER_PID=$!

# 3. Start FastAPI backend on 127.0.0.1:8000
echo "Starting FastAPI backend on 127.0.0.1:8000..."
python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 &
FASTAPI_PID=$!

# Wait for FastAPI to become ready
echo "Waiting for FastAPI to become ready..."
for i in $(seq 1 15); do
    if python -c "import urllib.request; urllib.request.urlopen('http://127.0.0.1:8000/docs', timeout=2)" 2>/dev/null; then
        echo "FastAPI backend is ready."
        break
    fi
    sleep 1
done

# 4. Start Next.js Frontend
echo "Starting Next.js frontend on 0.0.0.0:$PORT..."
cd /app/frontend

mkdir -p /app/frontend/public
cp -rn /app/frontend/apps/web/public/* /app/frontend/public/ 2>/dev/null || true

node apps/web/server.js &
FRONTEND_PID=$!

echo "VCT Connect is ready to accept requests on port $PORT"

# Wait for any process to terminate
wait -n "$FRONTEND_PID" "$FASTAPI_PID" "$WORKER_PID"
cleanup
