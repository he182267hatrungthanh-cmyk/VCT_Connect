"use client";

import React, { useEffect, useState } from "react";
import type { AccountState, PaymentOrder } from "@vct/contracts";
import { createPaymentOrder, getPaymentOrderStatus, simulatePayment } from "@vct/api-client";

function dateTime(value: string | null) {
  if (!value) return "Chưa có";
  const date = new Date(value);
  if (Number.isNaN(date.valueOf())) return "Chưa xác định";
  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function AccountStateView({
  state,
  getToken,
  onRefresh,
}: {
  state: AccountState;
  getToken?: () => Promise<string | null>;
  onRefresh?: () => Promise<void> | void;
}) {
  const isUltra = state.plan === "PAID_ULTRA" || Boolean(state.ultra?.active);
  const isPro = !isUltra && (state.plan === "PAID_PRO" || Boolean(state.pro?.active));
  const trial = state.trial.active;

  const usagePercent = state.usage.limit > 0
    ? Math.min(100, Math.round((state.usage.used / state.usage.limit) * 100))
    : 0;

  // Payment modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [loadingOrder, setLoadingOrder] = useState(false);
  const [order, setOrder] = useState<PaymentOrder | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [simulating, setSimulating] = useState(false);
  const [orderError, setOrderError] = useState("");

  const handleStartUpgrade = async (planCode: "PRO_MONTHLY" | "ULTRA_MONTHLY" | "TOPUP_50" = "PRO_MONTHLY") => {
    if (!getToken) return;
    setModalOpen(true);
    setLoadingOrder(true);
    setOrderError("");
    setPaymentSuccess(false);
    try {
      const newOrder = await createPaymentOrder(planCode, { getToken });
      setOrder(newOrder);
    } catch (err) {
      setOrderError(err instanceof Error ? err.message : "Không thể tạo đơn thanh toán");
    } finally {
      setLoadingOrder(false);
    }
  };

  // Poll for payment completion
  useEffect(() => {
    if (!modalOpen || !order || order.status === "PAID" || paymentSuccess) return;

    const interval = setInterval(async () => {
      try {
        const res = await getPaymentOrderStatus(order.order_code);
        if (res.status === "PAID") {
          setPaymentSuccess(true);
          if (onRefresh) {
            void onRefresh();
          }
        }
      } catch {
        // Ignore polling network glitches
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [modalOpen, order, paymentSuccess, onRefresh]);

  const handleCopy = (text: string, fieldName: string) => {
    if (navigator?.clipboard) {
      void navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2000);
    }
  };

  const handleSimulate = async () => {
    if (!order || !getToken) return;
    setSimulating(true);
    try {
      await simulatePayment(order.order_code, { getToken });
      setPaymentSuccess(true);
      if (onRefresh) {
        void onRefresh();
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Giả lập thanh toán lỗi");
    } finally {
      setSimulating(false);
    }
  };

  return (
    <main className="dashboard account-dashboard" id="account">
      <section className="dashboard-intro">
        <div>
          <span className="pill pill-good">TÀI KHOẢN</span>
          <h1>Hồ sơ & quyền sử dụng</h1>
          <p>Trạng thái này được đọc trực tiếp từ tài khoản và quyền sử dụng đã lưu trên VCT Connect.</p>
        </div>
      </section>

      <div className="account-grid">
        <article className="account-card">
          <span className="card-label">HỒ SƠ</span>
          <h2>{state.user.email ?? "Tài khoản Clerk đã xác thực"}</h2>
          <dl>
            <div><dt>Vai trò</dt><dd>{state.user.role}</dd></div>
            <div>
              <dt>Gói hiện tại</dt>
              <dd>
                {isUltra ? (
                  <strong style={{ color: "#7c3aed" }}>Ultra (399 lượt/ngày)</strong>
                ) : isPro ? (
                  <strong style={{ color: "var(--brand-blue)" }}>Pro (100 lượt/ngày)</strong>
                ) : trial ? (
                  "MVP Trial"
                ) : (
                  "Free"
                )}
              </dd>
            </div>
            {Boolean(state.bonus_limit) && (
              <div><dt>Lượt cộng thêm</dt><dd>+{state.bonus_limit} lượt (Top-Up)</dd></div>
            )}
          </dl>
        </article>

        {isUltra ? (
          <article className="account-card" style={{ borderColor: "#7c3aed", background: "#fcfaff" }}>
            <span className="card-label" style={{ color: "#7c3aed" }}>GÓI ULTRA VIP</span>
            <h2>Đang hoạt động</h2>
            <dl>
              <div><dt>Bắt đầu</dt><dd>{dateTime(state.ultra?.starts_at ?? null)}</dd></div>
              <div><dt>Hết hạn</dt><dd>{dateTime(state.ultra?.expires_at ?? null)}</dd></div>
              <div><dt>Hạn mức</dt><dd>399 lượt phân tích / ngày</dd></div>
            </dl>
            <p className="account-safety-note" style={{ color: "#7c3aed" }}>
              Bạn đang sử dụng gói cao cấp nhất của VCT Connect!
            </p>
          </article>
        ) : isPro ? (
          <article className="account-card" style={{ borderColor: "var(--brand-blue)" }}>
            <span className="card-label" style={{ color: "var(--brand-blue)" }}>GÓI PRO</span>
            <h2>Đang hoạt động</h2>
            <dl>
              <div><dt>Bắt đầu</dt><dd>{dateTime(state.pro?.starts_at ?? null)}</dd></div>
              <div><dt>Hết hạn</dt><dd>{dateTime(state.pro?.expires_at ?? null)}</dd></div>
              <div><dt>Hạn mức</dt><dd>100 lượt phân tích / ngày</dd></div>
            </dl>
            <p className="account-safety-note" style={{ color: "var(--brand-blue)" }}>
              Cảm ơn bạn đã đồng hành cùng VCT Connect!
            </p>
          </article>
        ) : (
          <article className="account-card">
            <span className="card-label">MVP TRIAL</span>
            <h2>{trial ? "Đang hoạt động" : "Chưa hoạt động"}</h2>
            <dl>
              <div><dt>Bắt đầu</dt><dd>{dateTime(state.trial.starts_at)}</dd></div>
              <div><dt>Hết hạn</dt><dd>{dateTime(state.trial.expires_at)}</dd></div>
              <div><dt>Trạng thái bản ghi</dt><dd>{state.trial.status ?? "Không có entitlement"}</dd></div>
            </dl>
            <p className="account-safety-note">MVP hiện không tự động thu phí và không tự động gia hạn khi trial kết thúc.</p>
          </article>
        )}

        <article className="account-card account-usage-card">
          <span className="card-label">LƯỢT PHÂN TÍCH</span>
          <div className="account-usage-value"><strong>{state.usage.used}</strong><span>/ {state.usage.limit}</span></div>
          <div className="report-meter"><i style={{ width: `${usagePercent}%` }} /></div>
          <p>Còn {state.usage.remaining} lượt trong cửa sổ sử dụng hiện tại.</p>
          <small>Làm mới lúc {dateTime(state.usage.resets_at)}</small>
        </article>
      </div>

      {/* Pricing Options Section */}
      {getToken && (
        <section className="pricing-section">
          <h2 className="pricing-title">Các gói nâng cấp & mở rộng</h2>
          <p className="pricing-subtitle">Thanh toán tự động quét mã VietQR — Kích hoạt tài khoản ngay tức thì.</p>

          <div className="pricing-grid">
            {/* Top-up 50 Card */}
            <article className="pricing-card">
              <div>
                <h3>Gói Nạp Lượt Top-Up 50</h3>
                <p style={{ margin: 0, color: "var(--muted)", fontSize: "0.85rem" }}>
                  Cộng dồn thêm lượt khi bạn đang cần gấp
                </p>
                <div className="pricing-card-price">
                  29.000 đ <small>/ lần nạp</small>
                </div>
                <ul className="pricing-card-features">
                  <li><strong>+50 lượt dùng luôn</strong> (cộng dồn)</li>
                  <li>Hạn dùng 30 ngày</li>
                  <li>Dùng song song với gói hiện tại</li>
                </ul>
              </div>
              <button
                type="button"
                className="pricing-btn pricing-btn-topup"
                onClick={() => void handleStartUpgrade("TOPUP_50")}
              >
                Nạp ngay (+50 lượt)
              </button>
            </article>

            {/* Pro Monthly Card */}
            <article className="pricing-card pricing-card-featured">
              <span className="pricing-badge">PHỔ BIẾN NHẤT</span>
              <div>
                <h3>Gói Tháng (Pro Monthly)</h3>
                <p style={{ margin: 0, color: "var(--muted)", fontSize: "0.85rem" }}>
                  Dành cho cá nhân nhập hàng thường xuyên
                </p>
                <div className="pricing-card-price">
                  49.000 đ <small>/ 30 ngày</small>
                </div>
                <ul className="pricing-card-features">
                  <li><strong>100 lượt / 24h</strong> mỗi ngày</li>
                  <li>Hạn dùng 30 ngày</li>
                  <li>Hỗ trợ phân tích 1688 & Alibaba</li>
                  <li>Lưu trữ lịch sử & Watchlist</li>
                </ul>
              </div>
              <button
                type="button"
                className="pricing-btn pricing-btn-primary"
                onClick={() => void handleStartUpgrade("PRO_MONTHLY")}
              >
                Nâng cấp gói Pro ➔
              </button>
            </article>

            {/* Ultra Monthly Card */}
            <article className="pricing-card pricing-card-ultra">
              <span className="pricing-badge pricing-badge-ultra">VIP / TỐI ĐA</span>
              <div>
                <h3>Gói Ultra (399 lượt)</h3>
                <p style={{ margin: 0, color: "var(--muted)", fontSize: "0.85rem" }}>
                  Dành cho shop lớn, đội ngũ kinh doanh & doanh nghiệp
                </p>
                <div className="pricing-card-price">
                  299.000 đ <small>/ 30 ngày</small>
                </div>
                <ul className="pricing-card-features">
                  <li><strong>399 lượt / 24h</strong> phân tích tối đa</li>
                  <li>Hạn dùng 30 ngày</li>
                  <li>Ưu tiên hàng đợi trích xuất siêu tốc</li>
                  <li>Đầy đủ trích xuất chuyên sâu & báo cáo</li>
                </ul>
              </div>
              <button
                type="button"
                className="pricing-btn pricing-btn-ultra"
                onClick={() => void handleStartUpgrade("ULTRA_MONTHLY")}
              >
                Nâng cấp gói Ultra ★
              </button>
            </article>
          </div>
        </section>
      )}

      {/* Payment VietQR Modal */}
      {modalOpen && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="payment-modal">
            <button
              type="button"
              className="modal-close"
              aria-label="Đóng"
              onClick={() => setModalOpen(false)}
            >
              ✕
            </button>

            {loadingOrder && (
              <div style={{ textAlign: "center", padding: "2rem" }}>
                <p>Đang tạo mã thanh toán VietQR…</p>
              </div>
            )}

            {orderError && (
              <div style={{ textAlign: "center", padding: "1.5rem", color: "var(--red)" }}>
                <p>{orderError}</p>
                <button type="button" className="button button-ghost" onClick={() => setModalOpen(false)}>
                  Đóng
                </button>
              </div>
            )}

            {!loadingOrder && order && !paymentSuccess && (
              <>
                <div style={{ textAlign: "center" }}>
                  <span className="pill pill-good">VIETQR TỰ ĐỘNG</span>
                  <h2 style={{ margin: "0.5rem 0 0.2rem" }}>{order.plan_name}</h2>
                  <p style={{ margin: 0, color: "var(--muted)", fontSize: "0.9rem" }}>
                    Quét mã QR bằng ứng dụng ngân hàng bất kỳ để tự động nâng cấp.
                  </p>
                </div>

                <div className="payment-qr-wrap">
                  <img src={order.qr_url} alt="VietQR Thanh toán" className="vietqr-image" />
                </div>

                <div className="payment-details">
                  <div className="payment-row">
                    <span>Số tiền:</span>
                    <strong style={{ color: "var(--brand-blue)", fontSize: "1.05rem" }}>
                      {order.amount.toLocaleString("vi-VN")} đ
                    </strong>
                  </div>
                  <div className="payment-row">
                    <span>Ngân hàng:</span>
                    <strong>{order.bank_name}</strong>
                  </div>
                  <div className="payment-row">
                    <span>Số tài khoản:</span>
                    <div>
                      <strong>{order.bank_account}</strong>
                      <button
                        type="button"
                        className="copy-btn"
                        onClick={() => handleCopy(order.bank_account, "account")}
                      >
                        {copiedField === "account" ? "Đã chép!" : "Chép"}
                      </button>
                    </div>
                  </div>
                  <div className="payment-row">
                    <span>Chủ tài khoản:</span>
                    <strong>{order.bank_account_holder}</strong>
                  </div>
                  <div className="payment-row">
                    <span>Nội dung chuyển khoản (bắt buộc):</span>
                    <div>
                      <strong className="payment-code-highlight">{order.order_code}</strong>
                      <button
                        type="button"
                        className="copy-btn"
                        onClick={() => handleCopy(order.order_code, "code")}
                      >
                        {copiedField === "code" ? "Đã chép!" : "Chép mã"}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="polling-indicator">
                  <span className="pulse-dot" />
                  <span>Hệ thống đang tự động lắng nghe thanh toán…</span>
                </div>

                {/* Simulation button for demo / testing before real SePay activation */}
                <div className="demo-simulate-box">
                  <span>💡 <strong>Dành cho Demo / Thử nghiệm:</strong> Chưa kịp chuyển tiền thật?</span>
                  <br />
                  <button
                    type="button"
                    className="demo-simulate-btn"
                    disabled={simulating}
                    onClick={() => void handleSimulate()}
                  >
                    {simulating ? "Đang xử lý…" : "⚡ Bấm vào đây để Giả lập chuyển khoản thành công"}
                  </button>
                </div>
              </>
            )}

            {paymentSuccess && (
              <div className="payment-success-card">
                <div className="payment-success-icon">✓</div>
                <h2>Thanh toán thành công!</h2>
                <p>Tài khoản của bạn đã được nâng cấp hạn mức và cập nhật ngay lập tức.</p>
                <button
                  type="button"
                  className="button button-primary"
                  style={{ marginTop: "1rem" }}
                  onClick={() => setModalOpen(false)}
                >
                  Xong
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
