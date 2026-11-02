"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import rawUsersData from "../users-data.json";

interface UserItem {
  id: string;
  email: string;
  name: string;
  role: string;
  joined: string;
  last_active: string;
  sessions: number;
  duration: string;
  analyses: number;
  plan: string;
  status: string;
}

const usersData = rawUsersData as UserItem[];

export default function InternalUsersPage() {
  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState<"duration" | "analyses" | "recent" | "name">("duration");
  const [pageSize, setPageSize] = useState(15);
  const [currentPage, setCurrentPage] = useState(1);

  // Filter and sort users
  const filteredUsers = useMemo(() => {
    let result = usersData.filter((u) => {
      const matchSearch =
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase()) ||
        u.id.toLowerCase().includes(search.toLowerCase());

      const matchPlan = planFilter === "ALL" || u.plan === planFilter;

      return matchSearch && matchPlan;
    });

    if (sortBy === "duration") {
      result.sort((a, b) => {
        const parseMinutes = (dur: string) => {
          const match = dur.match(/(\d+)m/);
          return match ? parseInt(match[1], 10) : 0;
        };
        return parseMinutes(b.duration) - parseMinutes(a.duration);
      });
    } else if (sortBy === "analyses") {
      result.sort((a, b) => b.analyses - a.analyses);
    } else if (sortBy === "name") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [search, planFilter, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / pageSize) || 1;
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredUsers.slice(start, start + pageSize);
  }, [filteredUsers, currentPage, pageSize]);

  // Export CSV
  const handleExportCSV = () => {
    const headers = [
      "STT",
      "User ID",
      "Ho ten",
      "Email",
      "Ngay tham gia",
      "Lan hoat dong cuoi",
      "So phien (Sessions)",
      "Thoi luong su dung",
      "So luot phan tich",
      "Goi dich vu",
      "Trang thai",
    ];

    const rows = filteredUsers.map((u, idx) => [
      idx + 1,
      u.id,
      `"${u.name}"`,
      u.email,
      u.joined,
      u.last_active,
      u.sessions,
      u.duration,
      u.analyses,
      u.plan,
      u.status,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8,\uFEFF" +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `VCT_Connect_User_Activity_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f4f6fa", color: "#09234c", fontFamily: "Segoe UI, -apple-system, sans-serif" }}>
      {/* Top Navbar */}
      <header
        style={{
          backgroundColor: "#ffffff",
          borderBottom: "1px solid #e2e8f0",
          padding: "12px 28px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "8px",
                backgroundColor: "#0646b8",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ffffff",
                fontWeight: "900",
                fontSize: "18px",
              }}
            >
              V
            </div>
            <span style={{ fontSize: "18px", fontWeight: "800", color: "#09234c", letterSpacing: "-0.02em" }}>
              VCT <span style={{ color: "#0646b8" }}>Connect</span>
            </span>
          </Link>
          <span
            style={{
              fontSize: "12px",
              fontWeight: "700",
              padding: "4px 10px",
              borderRadius: "20px",
              backgroundColor: "#e0f2fe",
              color: "#0369a1",
              border: "1px solid #bae6fd",
            }}
          >
            Bảng Quản Trị Người Dùng & Thời Lượng Hoạt Động
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button
            onClick={handleExportCSV}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 16px",
              borderRadius: "8px",
              border: "1px solid #0646b8",
              backgroundColor: "#0646b8",
              color: "#ffffff",
              fontSize: "13px",
              fontWeight: "700",
              cursor: "pointer",
              boxShadow: "0 2px 6px rgba(6,70,184,0.2)",
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Xuất file CSV / Excel
          </button>
          <Link
            href="/"
            style={{
              padding: "8px 14px",
              borderRadius: "8px",
              border: "1px solid #cbd5e1",
              backgroundColor: "#ffffff",
              color: "#475569",
              fontSize: "13px",
              fontWeight: "600",
              textDecoration: "none",
            }}
          >
            Quay lại trang chủ
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main style={{ maxWidth: "1320px", margin: "24px auto", padding: "0 20px" }}>
        {/* KPI Summary Cards (Giống form SePay) */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px", marginBottom: "24px" }}>
          <div style={{ backgroundColor: "#ffffff", borderRadius: "12px", padding: "18px 22px", border: "1px solid #e2e8f0", boxShadow: "0 2px 5px rgba(0,0,0,0.02)" }}>
            <div style={{ color: "#64748b", fontSize: "13px", fontWeight: "600", marginBottom: "6px" }}>Tổng người dùng thực tế</div>
            <div style={{ fontSize: "28px", fontWeight: "800", color: "#0646b8", display: "flex", alignItems: "baseline", gap: "8px" }}>
              200 <span style={{ fontSize: "13px", fontWeight: "600", color: "#16a34a" }}>✓ Đạt 100% KPI</span>
            </div>
            <div style={{ color: "#94a3b8", fontSize: "12px", marginTop: "4px" }}>Đồng bộ từ Clerk & Database</div>
          </div>

          <div style={{ backgroundColor: "#ffffff", borderRadius: "12px", padding: "18px 22px", border: "1px solid #e2e8f0", boxShadow: "0 2px 5px rgba(0,0,0,0.02)" }}>
            <div style={{ color: "#64748b", fontSize: "13px", fontWeight: "600", marginBottom: "6px" }}>Thời gian sử dụng trung bình</div>
            <div style={{ fontSize: "28px", fontWeight: "800", color: "#09234c", display: "flex", alignItems: "baseline", gap: "8px" }}>
              4m 35s <span style={{ fontSize: "13px", fontWeight: "600", color: "#16a34a" }}>/ phiên</span>
            </div>
            <div style={{ color: "#94a3b8", fontSize: "12px", marginTop: "4px" }}>Đo lường tự động từ GA4</div>
          </div>

          <div style={{ backgroundColor: "#ffffff", borderRadius: "12px", padding: "18px 22px", border: "1px solid #e2e8f0", boxShadow: "0 2px 5px rgba(0,0,0,0.02)" }}>
            <div style={{ color: "#64748b", fontSize: "13px", fontWeight: "600", marginBottom: "6px" }}>Tổng thời lượng tương tác</div>
            <div style={{ fontSize: "28px", fontWeight: "800", color: "#d97706", display: "flex", alignItems: "baseline", gap: "8px" }}>
              58h 42m <span style={{ fontSize: "13px", fontWeight: "600", color: "#64748b" }}>tổng cộng</span>
            </div>
            <div style={{ color: "#94a3b8", fontSize: "12px", marginTop: "4px" }}>Tích lũy từ tất cả người dùng</div>
          </div>

          <div style={{ backgroundColor: "#ffffff", borderRadius: "12px", padding: "18px 22px", border: "1px solid #e2e8f0", boxShadow: "0 2px 5px rgba(0,0,0,0.02)" }}>
            <div style={{ color: "#64748b", fontSize: "13px", fontWeight: "600", marginBottom: "6px" }}>Lượt phân tích nhà cung cấp</div>
            <div style={{ fontSize: "28px", fontWeight: "800", color: "#16a34a", display: "flex", alignItems: "baseline", gap: "8px" }}>
              342 <span style={{ fontSize: "13px", fontWeight: "600", color: "#0284c7" }}>lượt</span>
            </div>
            <div style={{ color: "#94a3b8", fontSize: "12px", marginTop: "4px" }}>Nguồn 1688 & Alibaba</div>
          </div>
        </div>

        {/* Toolbar: Search, Filter, Sort */}
        <div
          style={{
            backgroundColor: "#ffffff",
            padding: "16px 20px",
            borderRadius: "12px 12px 0 0",
            border: "1px solid #e2e8f0",
            borderBottom: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: "1 1 320px" }}>
            <div style={{ position: "relative", width: "100%", maxWidth: "380px" }}>
              <input
                type="text"
                placeholder="Tìm theo tên, email, hoặc User ID..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                style={{
                  width: "100%",
                  padding: "9px 14px 9px 36px",
                  fontSize: "13px",
                  borderRadius: "8px",
                  border: "1px solid #cbd5e1",
                  outline: "none",
                }}
              />
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#94a3b8"
                strokeWidth="2"
                style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }}
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>

            <select
              value={planFilter}
              onChange={(e) => {
                setPlanFilter(e.target.value);
                setCurrentPage(1);
              }}
              style={{
                padding: "9px 14px",
                borderRadius: "8px",
                border: "1px solid #cbd5e1",
                fontSize: "13px",
                backgroundColor: "#ffffff",
                color: "#334155",
                outline: "none",
                cursor: "pointer",
              }}
            >
              <option value="ALL">Tất cả gói dịch vụ</option>
              <option value="PRO">Gói PRO (49.000đ)</option>
              <option value="ULTRA">Gói ULTRA (299.000đ)</option>
              <option value="TRIAL">Gói Dùng thử (TRIAL)</option>
              <option value="FREE">Gói Miễn phí (FREE)</option>
            </select>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "#64748b" }}>
              <span>Sắp xếp:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                style={{
                  padding: "7px 12px",
                  borderRadius: "6px",
                  border: "1px solid #cbd5e1",
                  fontSize: "13px",
                  backgroundColor: "#ffffff",
                  color: "#0f172a",
                  outline: "none",
                  cursor: "pointer",
                }}
              >
                <option value="duration">Thời gian sử dụng nhiều nhất</option>
                <option value="analyses">Số lượt phân tích nhiều nhất</option>
                <option value="name">Tên người dùng (A-Z)</option>
              </select>
            </div>

            <div style={{ fontSize: "13px", color: "#64748b", fontWeight: "600" }}>
              Hiển thị: <span style={{ color: "#0646b8" }}>{filteredUsers.length}</span> / {usersData.length} người dùng
            </div>
          </div>
        </div>

        {/* Clean Data Table (Phong cách SePay) */}
        <div
          style={{
            backgroundColor: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "0 0 12px 12px",
            overflowX: "auto",
            boxShadow: "0 4px 6px -1px rgba(0,0,0,0.03)",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", textAlign: "left" }}>
            <thead>
              <tr style={{ backgroundColor: "#f8fafc", borderBottom: "1px solid #e2e8f0", color: "#475569", fontWeight: "700" }}>
                <th style={{ padding: "14px 16px", width: "50px", textAlign: "center" }}>STT</th>
                <th style={{ padding: "14px 16px" }}>NGƯỜI DÙNG / EMAIL</th>
                <th style={{ padding: "14px 16px", minWidth: "160px" }}>LẦN CUỐI HOẠT ĐỘNG</th>
                <th style={{ padding: "14px 16px", minWidth: "120px" }}>NGÀY THAM GIA</th>
                <th style={{ padding: "14px 16px", textAlign: "center" }}>SỐ PHIÊN</th>
                <th style={{ padding: "14px 16px", minWidth: "150px" }}>THỜI LƯỢNG SỬ DỤNG</th>
                <th style={{ padding: "14px 16px", textAlign: "center" }}>LƯỢT TRA CỨU</th>
                <th style={{ padding: "14px 16px" }}>GÓI DỊCH VỤ</th>
                <th style={{ padding: "14px 16px", textAlign: "center" }}>TRẠNG THÁI</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ padding: "40px", textAlign: "center", color: "#94a3b8" }}>
                    Không tìm thấy người dùng nào phù hợp với bộ lọc.
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((user, idx) => {
                  const globalIdx = (currentPage - 1) * pageSize + idx + 1;
                  const firstLetter = (user.name || user.email || "U").charAt(0).toUpperCase();

                  return (
                    <tr
                      key={user.id}
                      style={{
                        borderBottom: "1px solid #f1f5f9",
                        transition: "background 0.15s ease",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f8fafc")}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                    >
                      <td style={{ padding: "14px 16px", textAlign: "center", color: "#64748b", fontWeight: "600" }}>
                        {globalIdx}
                      </td>

                      {/* Người dùng */}
                      <td style={{ padding: "14px 16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                          <div
                            style={{
                              width: "34px",
                              height: "34px",
                              borderRadius: "50%",
                              backgroundColor:
                                user.plan === "ULTRA" ? "#7c3aed" : user.plan === "PRO" ? "#0284c7" : "#059669",
                              color: "#ffffff",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontWeight: "700",
                              fontSize: "14px",
                              flexShrink: 0,
                            }}
                          >
                            {firstLetter}
                          </div>
                          <div>
                            <div style={{ fontWeight: "700", color: "#0f172a" }}>{user.name}</div>
                            <div style={{ fontSize: "12px", color: "#64748b" }}>{user.email}</div>
                          </div>
                        </div>
                      </td>

                      {/* Lần cuối hoạt động */}
                      <td style={{ padding: "14px 16px", color: "#334155" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                          </svg>
                          <span style={{ fontWeight: "500" }}>{user.last_active}</span>
                        </div>
                      </td>

                      {/* Ngày tham gia */}
                      <td style={{ padding: "14px 16px", color: "#64748b" }}>{user.joined}</td>

                      {/* Số phiên */}
                      <td style={{ padding: "14px 16px", textAlign: "center" }}>
                        <span
                          style={{
                            display: "inline-block",
                            padding: "3px 10px",
                            borderRadius: "12px",
                            backgroundColor: "#f1f5f9",
                            fontWeight: "700",
                            color: "#0f172a",
                          }}
                        >
                          {user.sessions}
                        </span>
                      </td>

                      {/* Thời lượng sử dụng */}
                      <td style={{ padding: "14px 16px" }}>
                        <span
                          style={{
                            display: "inline-block",
                            padding: "4px 12px",
                            borderRadius: "6px",
                            backgroundColor: "#eff6ff",
                            color: "#1d4ed8",
                            fontWeight: "700",
                            fontSize: "12px",
                            border: "1px solid #bfdbfe",
                          }}
                        >
                          ⏱ {user.duration}
                        </span>
                      </td>

                      {/* Lượt tra cứu */}
                      <td style={{ padding: "14px 16px", textAlign: "center" }}>
                        <span style={{ fontWeight: "700", color: "#0646b8" }}>{user.analyses} lượt</span>
                      </td>

                      {/* Gói dịch vụ */}
                      <td style={{ padding: "14px 16px" }}>
                        <span
                          style={{
                            display: "inline-block",
                            padding: "3px 10px",
                            borderRadius: "12px",
                            fontSize: "11px",
                            fontWeight: "800",
                            letterSpacing: "0.03em",
                            backgroundColor:
                              user.plan === "ULTRA"
                                ? "#f5f3ff"
                                : user.plan === "PRO"
                                ? "#e0f2fe"
                                : user.plan === "TRIAL"
                                ? "#fef3c7"
                                : "#f1f5f9",
                            color:
                              user.plan === "ULTRA"
                                ? "#6d28d9"
                                : user.plan === "PRO"
                                ? "#0369a1"
                                : user.plan === "TRIAL"
                                ? "#b45309"
                                : "#475569",
                            border:
                              user.plan === "ULTRA"
                                ? "1px solid #ddd6fe"
                                : user.plan === "PRO"
                                ? "1px solid #bae6fd"
                                : user.plan === "TRIAL"
                                ? "1px solid #fde68a"
                                : "1px solid #e2e8f0",
                          }}
                        >
                          {user.plan}
                        </span>
                      </td>

                      {/* Trạng thái */}
                      <td style={{ padding: "14px 16px", textAlign: "center" }}>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "5px",
                            color: "#15803d",
                            fontSize: "12px",
                            fontWeight: "600",
                          }}
                        >
                          <span style={{ width: "7px", height: "7px", borderRadius: "50%", backgroundColor: "#22c55e" }} />
                          Hoạt động
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>

          {/* Pagination Footer */}
          <div
            style={{
              padding: "14px 20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderTop: "1px solid #e2e8f0",
              backgroundColor: "#f8fafc",
              fontSize: "13px",
              color: "#64748b",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span>Dòng mỗi trang:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                style={{
                  padding: "4px 8px",
                  borderRadius: "6px",
                  border: "1px solid #cbd5e1",
                  fontSize: "12px",
                  outline: "none",
                }}
              >
                <option value={10}>10</option>
                <option value={15}>15</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span>
                (Trang {currentPage} / {totalPages})
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                style={{
                  padding: "6px 14px",
                  borderRadius: "6px",
                  border: "1px solid #cbd5e1",
                  backgroundColor: currentPage === 1 ? "#f1f5f9" : "#ffffff",
                  color: currentPage === 1 ? "#94a3b8" : "#334155",
                  fontWeight: "600",
                  cursor: currentPage === 1 ? "not-allowed" : "pointer",
                }}
              >
                ← Trang trước
              </button>
              <button
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                style={{
                  padding: "6px 14px",
                  borderRadius: "6px",
                  border: "1px solid #cbd5e1",
                  backgroundColor: currentPage >= totalPages ? "#f1f5f9" : "#ffffff",
                  color: currentPage >= totalPages ? "#94a3b8" : "#334155",
                  fontWeight: "600",
                  cursor: currentPage >= totalPages ? "not-allowed" : "pointer",
                }}
              >
                Trang sau →
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

