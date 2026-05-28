import React, { useEffect, useMemo, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { api } from "./services/api";
import LandingPage from "./components/LandingPage";
import Scriptorium from "./components/Scriptorium";

function LandingRoute() {
  const navigate = useNavigate();

  return (
    <LandingPage
      onSelectWeaver={() => navigate("/weaver")}
      onSelectScholar={() => navigate("/scholar")}
    />
  );
}

function WeaverRoute() {
  const navigate = useNavigate();

  return <Scriptorium onBack={() => navigate("/")} />;
}

function ScholarComingSoon() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(135deg, #020617 0%, #111827 50%, #1e293b 100%)",
        padding: "24px",
        fontFamily: "Arial",
        color: "white",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "520px",
          background: "rgba(255,255,255,0.08)",
          border: "1px solid rgba(255,255,255,0.1)",
          backdropFilter: "blur(18px)",
          borderRadius: "28px",
          padding: "42px",
          textAlign: "center",
          boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
        }}
      >
        <h1 style={{ fontSize: "34px", marginBottom: "12px" }}>
          Scholar’s Sanctum
        </h1>
        <p style={{ color: "#cbd5e1", lineHeight: 1.7, marginBottom: "28px" }}>
          This path is available, and the writing flow is in the project.
          The main public submission flow is under Weaver Path.
        </p>
        <button
          onClick={() => navigate("/")}
          style={{
            padding: "14px 22px",
            borderRadius: "14px",
            border: "none",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "bold",
            background: "linear-gradient(135deg,#f8fafc,#e2e8f0)",
            color: "#0f172a",
          }}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}

function AdminGate() {
  const { user, login } = useAuth();

  if (!user) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, #020617 0%, #111827 50%, #1e293b 100%)",
          padding: "24px",
          fontFamily: "Arial",
          color: "white",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "520px",
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.1)",
            backdropFilter: "blur(18px)",
            borderRadius: "28px",
            padding: "42px",
            textAlign: "center",
            boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
          }}
        >
          <h1 style={{ fontSize: "34px", marginBottom: "12px" }}>
            Admin Dashboard
          </h1>
          <p style={{ color: "#cbd5e1", lineHeight: 1.7, marginBottom: "28px" }}>
            Please sign in with the admin account to view submissions.
          </p>
          <button
            onClick={login}
            style={{
              padding: "14px 22px",
              borderRadius: "14px",
              border: "none",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "bold",
              background: "linear-gradient(135deg,#f8fafc,#e2e8f0)",
              color: "#0f172a",
            }}
          >
            Login to Admin
          </button>
        </div>
      </div>
    );
  }

  return <DashboardPage />;
}

function DashboardPage() {
  const { user, logout } = useAuth();

  const [adminData, setAdminData] = useState([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [adminError, setAdminError] = useState("");
  const [updatingId, setUpdatingId] = useState("");

  const loadSubmissions = async () => {
    try {
      if (!user) return;

      const token = await user.getIdToken();
      const submissionsResponse = await api.getAdminSubmissions(token);

      setAdminData(submissionsResponse.data || []);
      setAdminError("");
    } catch (err) {
      console.error("Admin error:", err);
      setAdminError(err.message || "Failed to load submissions");
    } finally {
      setIsInitialLoading(false);
    }
  };

  useEffect(() => {
    loadSubmissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const updateStatus = async (id, status) => {
    try {
      if (!user) return;

      setUpdatingId(id);

      setAdminData((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status } : item))
      );

      const token = await user.getIdToken();

      const res = await fetch(
        `http://localhost:5000/api/admin/submissions/${id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update status");
      }

      setTimeout(() => {
        loadSubmissions();
      }, 1200);
    } catch (err) {
      console.error("Update status error:", err);
      alert(err.message || "Failed to update status");
      loadSubmissions();
    } finally {
      setUpdatingId("");
    }
  };

  const totals = useMemo(() => {
    const approved = adminData.filter((x) => x.status === "approved").length;
    const rejected = adminData.filter((x) => x.status === "rejected").length;
    const pending = adminData.filter((x) => x.status === "submitted").length;

    return { approved, rejected, pending };
  }, [adminData]);

  const statusStyle = (status) => {
    if (status === "approved") return { background: "#dcfce7", color: "#166534" };
    if (status === "rejected") return { background: "#fee2e2", color: "#991b1b" };
    return { background: "#e0f2fe", color: "#0369a1" };
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        padding: "28px",
        fontFamily: "Arial",
      }}
    >
      <div style={{ maxWidth: "1450px", margin: "0 auto" }}>
        <div
          style={{
            background: "linear-gradient(135deg,#0f172a,#1e293b)",
            borderRadius: "26px",
            padding: "28px",
            color: "white",
            marginBottom: "28px",
            boxShadow: "0 20px 50px rgba(15,23,42,0.2)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "16px",
            }}
          >
            <div>
              <h1 style={{ margin: 0, fontSize: "34px" }}>Admin Dashboard</h1>
              <p style={{ color: "#cbd5e1", marginTop: "8px" }}>
                Logged in as <strong>{user?.email}</strong>
              </p>
            </div>

            <button
              onClick={logout}
              style={{
                border: "none",
                padding: "12px 18px",
                borderRadius: "14px",
                cursor: "pointer",
                fontWeight: "bold",
                background: "white",
                color: "#0f172a",
              }}
            >
              Logout
            </button>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
            gap: "20px",
            marginBottom: "28px",
          }}
        >
          <StatsCard title="Total Submissions" value={adminData.length} color="#2563eb" />
          <StatsCard title="Approved" value={totals.approved} color="#16a34a" />
          <StatsCard title="Rejected" value={totals.rejected} color="#dc2626" />
          <StatsCard title="Pending" value={totals.pending} color="#0284c7" />
        </div>

        <div
          style={{
            background: "white",
            borderRadius: "24px",
            padding: "24px",
            boxShadow: "0 10px 30px rgba(15,23,42,0.08)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "20px",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            <div>
              <h2 style={{ margin: 0, color: "#0f172a", fontSize: "26px" }}>
                Manuscript Submissions
              </h2>
              <p style={{ margin: "8px 0 0", color: "#64748b" }}>
                Review, approve, and reject client requests.
              </p>
            </div>

            <div
              style={{
                background: "#f1f5f9",
                padding: "10px 14px",
                borderRadius: "999px",
                fontWeight: "bold",
                color: "#334155",
              }}
            >
              Total: {adminData.length}
            </div>
          </div>

          {adminError && (
            <div
              style={{
                background: "#fee2e2",
                color: "#991b1b",
                padding: "14px",
                borderRadius: "14px",
                marginBottom: "18px",
              }}
            >
              {adminError}
            </div>
          )}

          {isInitialLoading ? (
            <div style={{ display: "grid", gap: "12px" }}>
              <SkeletonRow />
              <SkeletonRow />
              <SkeletonRow />
              <SkeletonRow />
              <SkeletonRow />
            </div>
          ) : adminData.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "70px 20px",
                color: "#64748b",
              }}
            >
              No submissions found.
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "separate",
                  borderSpacing: "0 14px",
                  minWidth: "1150px",
                }}
              >
                <thead>
                  <tr>
                    <th style={thStyle}>Title</th>
                    <th style={thStyle}>Name</th>
                    <th style={thStyle}>Email</th>
                    <th style={thStyle}>Phone</th>
                    <th style={thStyle}>Type</th>
                    <th style={thStyle}>Status</th>
                    <th style={thStyle}>File</th>
                    <th style={thStyle}>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {adminData.map((item) => (
                    <tr
                      key={item.id}
                      style={{
                        background: "#ffffff",
                        boxShadow: "0 8px 24px rgba(15,23,42,0.06)",
                      }}
                    >
                      <td style={tdStyle}>{item.title}</td>
                      <td style={tdStyle}>{item.name}</td>
                      <td style={tdStyle}>{item.email}</td>
                      <td style={tdStyle}>{item.phone}</td>
                      <td style={tdStyle}>{item.manuscriptType}</td>

                      <td style={tdStyle}>
                        <span
                          style={{
                            padding: "6px 14px",
                            borderRadius: "999px",
                            fontWeight: "bold",
                            fontSize: "13px",
                            textTransform: "capitalize",
                            ...statusStyle(item.status),
                          }}
                        >
                          {item.status}
                        </span>
                      </td>

                      <td style={tdStyle}>
                        {item.filePath ? (
                          <a
                            href={`http://localhost:5000/${item.filePath}`}
                            target="_blank"
                            rel="noreferrer"
                            style={{
                              textDecoration: "none",
                              color: "#2563eb",
                              fontWeight: "bold",
                            }}
                          >
                            View File
                          </a>
                        ) : (
                          <span style={{ color: "#94a3b8" }}>No File</span>
                        )}
                      </td>

                      <td style={tdStyle}>
                        <div style={{ display: "flex", gap: "10px" }}>
                          <button
                            disabled={updatingId === item.id}
                            onClick={() => updateStatus(item.id, "approved")}
                            style={{
                              ...actionBtn,
                              background: "linear-gradient(135deg,#22c55e,#16a34a)",
                              opacity: updatingId === item.id ? 0.75 : 1,
                            }}
                          >
                            Approve
                          </button>

                          <button
                            disabled={updatingId === item.id}
                            onClick={() => updateStatus(item.id, "rejected")}
                            style={{
                              ...actionBtn,
                              background: "linear-gradient(135deg,#ef4444,#dc2626)",
                              opacity: updatingId === item.id ? 0.75 : 1,
                            }}
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatsCard({ title, value, color }) {
  return (
    <div
      style={{
        background: "white",
        borderRadius: "22px",
        padding: "24px",
        boxShadow: "0 10px 24px rgba(15,23,42,0.08)",
        borderTop: `5px solid ${color}`,
      }}
    >
      <p style={{ margin: 0, color: "#64748b", fontWeight: "bold" }}>{title}</p>
      <h2
        style={{
          margin: "12px 0 0",
          fontSize: "38px",
          color: "#0f172a",
        }}
      >
        {value}
      </h2>
    </div>
  );
}

function SkeletonRow() {
  return (
    <div
      style={{
        height: "64px",
        borderRadius: "16px",
        background:
          "linear-gradient(90deg, #e2e8f0 25%, #f8fafc 37%, #e2e8f0 63%)",
        backgroundSize: "400% 100%",
        animation: "shimmer 1.5s infinite",
      }}
    />
  );
}

const thStyle = {
  textAlign: "left",
  padding: "14px 16px",
  color: "#64748b",
  fontWeight: "bold",
  fontSize: "14px",
};

const tdStyle = {
  padding: "18px 16px",
  color: "#0f172a",
  fontSize: "14px",
};

const actionBtn = {
  border: "none",
  padding: "10px 16px",
  borderRadius: "12px",
  cursor: "pointer",
  color: "white",
  fontWeight: "bold",
  boxShadow: "0 8px 18px rgba(0,0,0,0.12)",
};

function App() {
  const { user } = useAuth();

  return (
    <>
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>

      <Routes>
        <Route path="/" element={<LandingRoute />} />
        <Route path="/weaver" element={<WeaverRoute />} />
        <Route path="/scholar" element={<ScholarComingSoon />} />
        <Route path="/dashboard" element={<AdminGate />} />
      </Routes>
    </>
  );
}

export default App;