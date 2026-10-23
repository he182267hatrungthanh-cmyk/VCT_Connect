from yoyo import step

__depends__ = {"0017_extension_collection_jobs"}

steps = [step("""
CREATE TABLE payment_orders (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  order_code TEXT NOT NULL UNIQUE,
  plan_code TEXT NOT NULL,
  amount INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'PENDING',
  gateway TEXT NOT NULL DEFAULT 'SEPAY',
  gateway_transaction_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  paid_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ NOT NULL,
  CONSTRAINT payment_orders_status_check CHECK (status IN ('PENDING', 'PAID', 'EXPIRED', 'CANCELLED')),
  CONSTRAINT payment_orders_plan_code_check CHECK (plan_code IN ('PRO_MONTHLY', 'TOPUP_50', 'ULTRA_MONTHLY'))
);

CREATE INDEX payment_orders_user_idx ON payment_orders(user_id);
CREATE INDEX payment_orders_order_code_idx ON payment_orders(order_code);
""", "DROP TABLE payment_orders;")]
