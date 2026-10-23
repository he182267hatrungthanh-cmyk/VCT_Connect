from datetime import datetime, timedelta, timezone
import random
import re
import urllib.parse
from fastapi import Depends, HTTPException, Request
from pydantic import BaseModel
from starlette.concurrency import run_in_threadpool


class CreateOrderRequest(BaseModel):
    plan_code: str = "PRO_MONTHLY"


class SimulatePaymentRequest(BaseModel):
    order_code: str


PLAN_PRICING = {
    "PRO_MONTHLY": {
        "amount": 49000,
        "name": "VCT Connect Pro (100 lượt/24h - 30 ngày)",
        "daily_limit": 100,
    },
    "TOPUP_50": {
        "amount": 29000,
        "name": "Gói Nạp Lượt Top-Up (+50 lượt - 30 ngày)",
        "daily_limit": 50,
    },
    "ULTRA_MONTHLY": {
        "amount": 299000,
        "name": "VCT Connect Ultra (399 lượt/24h - 30 ngày)",
        "daily_limit": 399,
    },
}


def register_payment_routes(app, store, settings, customer_dependency):
    @app.post("/api/v1/payments/create-order", status_code=201)
    async def create_order(
        body: CreateOrderRequest,
        principal=Depends(customer_dependency),
    ):
        plan = PLAN_PRICING.get(body.plan_code)
        if not plan:
            raise HTTPException(400, "Unsupported plan code")

        # Generate a distinct 6-digit order code with VCT prefix, e.g. VCT684920
        order_code = f"VCT{random.randint(100000, 999999)}"
        expires_at = datetime.now(timezone.utc) + timedelta(minutes=15)

        try:
            order = await run_in_threadpool(
                store.create_payment_order,
                user_id=principal.user_id,
                plan_code=body.plan_code,
                amount=plan["amount"],
                order_code=order_code,
                expires_at=expires_at,
                gateway="SEPAY",
            )
        except Exception as exc:
            raise HTTPException(500, "Failed to create payment order") from exc

        # Generate VietQR image URL
        account_name_encoded = urllib.parse.quote(settings.payment_bank_account_holder)
        qr_url = (
            f"https://img.vietqr.io/image/{settings.payment_bank_name}-"
            f"{settings.payment_bank_account}-compact2.png"
            f"?amount={plan['amount']}&addInfo={order_code}&accountName={account_name_encoded}"
        )

        return {
            "order_code": order["order_code"],
            "plan_code": order["plan_code"],
            "plan_name": plan["name"],
            "daily_limit": plan["daily_limit"],
            "amount": order["amount"],
            "currency": "VND",
            "bank_name": settings.payment_bank_name,
            "bank_account": settings.payment_bank_account,
            "bank_account_holder": settings.payment_bank_account_holder,
            "qr_url": qr_url,
            "status": order["status"],
            "expires_at": order["expires_at"].isoformat() if hasattr(order["expires_at"], "isoformat") else str(order["expires_at"]),
        }

    @app.get("/api/v1/payments/orders/{order_code}/status")
    async def order_status(order_code: str):
        try:
            order = await run_in_threadpool(store.get_payment_order, order_code)
        except Exception as exc:
            raise HTTPException(500, "Database error") from exc

        if not order:
            raise HTTPException(404, "Order not found")

        return {
            "order_code": order["order_code"],
            "plan_code": order["plan_code"],
            "amount": order["amount"],
            "status": order["status"],
            "paid_at": order["paid_at"].isoformat() if order.get("paid_at") and hasattr(order["paid_at"], "isoformat") else (str(order["paid_at"]) if order.get("paid_at") else None),
        }

    @app.post("/api/v1/payments/webhook")
    async def sepay_webhook(request: Request):
        """Receive SePay bank transfer webhook and automatically upgrade customer."""
        # Authenticate webhook if SEPAY_API_KEY is configured
        if settings.sepay_api_key:
            auth_header = request.headers.get("authorization", "").strip()
            token = auth_header
            for prefix in ("apikey ", "bearer "):
                if token.lower().startswith(prefix):
                    token = token[len(prefix):].strip()
                    break
            if token != settings.sepay_api_key and auth_header != settings.sepay_api_key:
                raise HTTPException(401, "Invalid webhook authorization")

        try:
            payload = await request.json()
        except Exception:
            raise HTTPException(400, "Invalid JSON payload")

        # SePay payload structure
        # transferType is typically 'in' for money received
        transfer_type = payload.get("transferType", "in")
        if transfer_type != "in":
            return {"success": True, "message": "Ignored outgoing transfer"}

        content = str(payload.get("content", ""))
        amount_in = payload.get("transferAmount")
        transaction_id = str(payload.get("id") or payload.get("referenceCode") or "")

        # Find order_code matching VCT[0-9]{6}
        match = re.search(r"\b(VCT\d{6})\b", content, re.IGNORECASE)
        if not match:
            # Also try matching without word boundary if bank stripped spaces
            match = re.search(r"(VCT\d{6})", content, re.IGNORECASE)

        if not match:
            return {"success": True, "message": "No matching VCT order code in transaction content"}

        matched_code = match.group(1).upper()

        fulfilled = await run_in_threadpool(
            store.fulfill_payment_order,
            order_code=matched_code,
            gateway_transaction_id=transaction_id,
            paid_amount=int(amount_in) if amount_in is not None else None,
        )

        return {
            "success": fulfilled,
            "order_code": matched_code,
            "message": "Account upgraded to Pro successfully" if fulfilled else "Order fulfillment failed or underpaid",
        }

    @app.post("/api/v1/payments/simulate-success")
    async def simulate_payment(
        body: SimulatePaymentRequest,
        principal=Depends(customer_dependency),
    ):
        """Allows testing / demoing payment fulfillment immediately."""
        fulfilled = await run_in_threadpool(
            store.fulfill_payment_order,
            order_code=body.order_code,
            gateway_transaction_id="DEMO_SIMULATION",
        )
        if not fulfilled:
            raise HTTPException(400, "Order not found or could not be fulfilled")

        return {
            "success": True,
            "order_code": body.order_code,
            "message": "Đã giả lập thanh toán thành công! Tài khoản đã được nâng cấp lên Pro.",
        }
