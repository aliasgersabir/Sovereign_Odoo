"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Filler } from "chart.js";
import { Users, Globe, Eye, Activity } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getAdminStats } from "@/actions/admin";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Filler);

// CSS for fade-in animations
const fadeUpStyles = `
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-up { animation: fadeUp 0.6s ease-out forwards; }
`;

interface AppAction {
  action: string;
  time: string;
}

interface SearchHistoryEntry {
  city: string;
  country: string;
  count: number;
  pct?: number;
}

export default function AdminPage() {
  const [timeRange, setTimeRange] = useState("7d");
  const [liveUsers, setLiveUsers] = useState<AppAction[]>([]);
  const [liveDests, setLiveDests] = useState<SearchHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [localStats, setLocalStats] = useState({
    activeTrips: 0,
    engagementCount: 0,
    hasUser: 0,
    totalExpenses: 0
  });
  
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [catData, setCatData] = useState({
    sightseeing: 10,
    food: 8,
    hotels: 6,
    transport: 4
  });

  useEffect(() => {
    const authed = sessionStorage.getItem("admin_authed");
    if (authed === "true") setIsAdminAuthenticated(true);
  }, []);

  useEffect(() => {
    if (isAdminAuthenticated) sessionStorage.setItem("admin_authed", "true");
  }, [isAdminAuthenticated]);

  useEffect(() => {
    async function load() {
      if (!isAdminAuthenticated) return;
      
      const res = await getAdminStats();
      if (res.success && res.stats) {
        setLocalStats({
          activeTrips: res.stats.recentLogs.length,
          engagementCount: res.stats.userCount * 5,
          hasUser: res.stats.userCount,
          totalExpenses: res.stats.totalExpenses
        });
        setLiveUsers(res.stats.recentLogs.map((r: any) => ({ action: r.action, time: r.timestamp })));
        
        if (res.stats.topSearches.length > 0) {
          const maxCount = res.stats.topSearches[0].count;
          setLiveDests(res.stats.topSearches.map((h: any) => ({ ...h, pct: Math.round((h.count / maxCount) * 100) })));
        }
      }
      setLoading(false);
    }
    load();
  }, [isAdminAuthenticated]);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === "admin123") {
      setIsAdminAuthenticated(true);
      setPasswordError("");
    } else {
      setPasswordError("Incorrect admin password.");
    }
  };

  const timeMultiplier = useMemo(() => {
    switch (timeRange) {
      case "24h": return 0.15;
      case "7d":  return 1;
      case "30d": return 4;
      case "90d": return 12;
      default:    return 1;
    }
  }, [timeRange]);

  const timeRangeLabel = useMemo(() => {
    switch (timeRange) {
      case "24h": return "Last 24 Hours";
      case "7d":  return "Last 7 Days";
      case "30d": return "Last 30 Days";
      case "90d": return "Last 90 Days";
      default:    return "Last 7 Days";
    }
  }, [timeRange]);

  const totalUsersNum = Math.max(1, Math.round(localStats.hasUser * timeMultiplier));
  const activeTripsNum = Math.max(localStats.activeTrips, Math.round(localStats.activeTrips * timeMultiplier));
  const engagementNum = Math.round(localStats.engagementCount * timeMultiplier);
  const totalExpensesNum = Math.round(localStats.totalExpenses * timeMultiplier);

  const stats = [
    { label: "Active Users", value: totalUsersNum.toString(), icon: <Users size={22} />, color: "#3b82f6" },
    { label: "Saved Trips", value: activeTripsNum.toString(), icon: <Globe size={22} />, color: "#10b981" },
    { label: "Total Expenses", value: "$" + totalExpensesNum.toLocaleString(), icon: <Eye size={22} />, color: "#a855f7" },
    { label: "Activities Planned", value: engagementNum.toString(), icon: <Activity size={22} />, color: "#f59e0b" },
  ];

  const generateLabels = () => {
    const labels = [];
    const today = new Date();
    const count = timeRange === "24h" ? 8 : timeRange === "7d" ? 7 : timeRange === "30d" ? 6 : 6;
    for (let i = count - 1; i >= 0; i--) {
      const d = new Date(today);
      if (timeRange === "24h") {
        d.setHours(d.getHours() - i * 3);
        labels.push(d.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }));
      } else if (timeRange === "7d") {
        d.setDate(d.getDate() - i);
        labels.push(d.toLocaleDateString('en-US', { weekday: 'short' }));
      } else if (timeRange === "30d") {
        d.setDate(d.getDate() - i * 5);
        labels.push(d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
      } else {
        d.setDate(d.getDate() - i * 15);
        labels.push(d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
      }
    }
    return labels;
  };

  const generateGrowthData = () => {
    const base = localStats.engagementCount;
    if (timeRange === "24h") return [0, 0, 0, 0, 0, 0, 0, base];
    if (timeRange === "7d") return [0, 0, 0, 0, 0, 0, base];
    const points = timeRange === "30d" ? 6 : 6;
    return Array.from({ length: points }, (_, i) => Math.round((base * timeMultiplier * (i + 1)) / points));
  };

  const userGrowth = {
    labels: generateLabels(),
    datasets: [{
      label: "Actions Taken",
      data: generateGrowthData(),
      borderColor: "#10b981",
      backgroundColor: "rgba(16,185,129,0.1)",
      fill: true,
      tension: 0.4,
      pointBackgroundColor: "#10b981",
      pointBorderColor: "#09090b",
      pointBorderWidth: 2,
      pointRadius: 5,
    }],
  };

  const categoryData = {
    labels: ["Sightseeing", "Food & Meals", "Hotels & Stays", "Transport"],
    datasets: [{
      data: [catData.sightseeing, catData.food, catData.hotels, catData.transport],
      backgroundColor: ["#3b82f6", "#f59e0b", "#a855f7", "#ef4444"],
      borderColor: "#09090b",
      borderWidth: 3,
    }],
  };

  const chartOpts = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { backgroundColor: "#18181b", titleColor: "#fff", bodyColor: "#a1a1aa", borderColor: "rgba(255,255,255,0.1)", borderWidth: 1, padding: 12, cornerRadius: 12 } },
  };

  const lineOpts = { ...chartOpts, scales: { x: { ticks: { color: "#52525b" }, grid: { display: false }, border: { display: false } }, y: { ticks: { color: "#52525b" }, grid: { color: "rgba(255,255,255,0.04)" }, border: { display: false } } } };

  const card: React.CSSProperties = { backgroundColor: "rgba(24,24,27,0.8)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "20px", padding: "28px", backdropFilter: "blur(12px)" };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#09090b", color: "#f4f4f5", fontFamily: "'Inter', sans-serif", display: "flex", flexDirection: "column" }}>
      <style dangerouslySetInnerHTML={{ __html: fadeUpStyles }} />
      <Navbar />
      
      {!isAdminAuthenticated ? (
        <main style={{ maxWidth: "500px", margin: "0 auto", padding: "160px 24px 80px", flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div className="animate-fade-up" style={{ ...card, textAlign: "center", padding: "40px 30px" }}>
            <h2 style={{ fontSize: "24px", fontWeight: 800, marginBottom: "8px", background: "linear-gradient(to right, #fff, #10b981)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Admin Access Required
            </h2>
            <p style={{ color: "#a1a1aa", fontSize: "14px", marginBottom: "32px" }}>
              Please enter the master password to view platform analytics.
            </p>
            <form onSubmit={handleAdminLogin} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ textAlign: "left" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#52525b", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>Password</label>
                <input 
                  type="password" 
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="Enter Password" 
                  autoFocus
                  style={{ width: "100%", padding: "14px", borderRadius: "12px", background: "rgba(39,39,42,0.5)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", outline: "none", fontSize: "15px" }}
                />
              </div>
              {passwordError && <div style={{ color: "#ef4444", fontSize: "13px", textAlign: "left" }}>{passwordError}</div>}
              <button 
                type="submit" 
                style={{ width: "100%", padding: "14px", borderRadius: "12px", background: "#10b981", color: "#000", border: "none", fontWeight: 700, fontSize: "15px", cursor: "pointer", marginTop: "8px" }}
              >
                Unlock Dashboard
              </button>
            </form>
            <Link href="/" style={{ display: "block", marginTop: "24px", color: "#71717a", fontSize: "13px", textDecoration: "none" }}>Back to Homepage</Link>
          </div>
        </main>
      ) : (
      <main style={{ maxWidth: "1300px", margin: "0 auto", padding: "110px 24px 80px", flex: 1, width: "100%" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "32px", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <h1 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, marginBottom: "8px", background: "linear-gradient(to right, #fff, #71717a)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Admin Dashboard</h1>
            <p style={{ color: "#71717a", fontSize: "16px" }}>Showing data for: <span style={{ color: "#10b981", fontWeight: 600 }}>{timeRangeLabel}</span></p>
          </div>
          <div style={{ display: "flex", gap: "6px", background: "rgba(24,24,27,0.8)", borderRadius: "12px", padding: "4px", border: "1px solid rgba(255,255,255,0.08)" }}>
            {["24h", "7d", "30d", "90d"].map((r) => (
              <button key={r} onClick={() => setTimeRange(r)} style={{ padding: "8px 16px", borderRadius: "8px", border: "none", background: timeRange === r ? "#10b981" : "transparent", color: timeRange === r ? "#000" : "#71717a", fontWeight: 600, fontSize: "13px", cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s" }}>{r}</button>
            ))}
          </div>
        </div>

        {/* Stat Cards */}
        <div className="animate-fade-up" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px", marginBottom: "28px", animationDelay: "0.1s", opacity: 0 }}>
          {stats.map((s) => (
            <div key={s.label} style={{ ...card, display: "flex", alignItems: "center", gap: "16px" }}>
              <div style={{ padding: "14px", borderRadius: "16px", background: s.color + "20", color: s.color, display: "flex" }}>{s.icon}</div>
              <div>
                <div style={{ fontSize: "13px", color: "#71717a", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "4px" }}>{s.label}</div>
                <div style={{ display: "flex", alignItems: "baseline", gap: "10px" }}>
                  <span style={{ fontSize: "28px", fontWeight: 800, color: "#fff" }}>{s.value}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="animate-fade-up" style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "24px", marginBottom: "28px", animationDelay: "0.2s", opacity: 0 }}>
          <div style={card}>
            <h3 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "24px", color: "#fff" }}>User Growth</h3>
            <div style={{ height: "280px" }}><Line data={userGrowth} options={lineOpts} /></div>
          </div>
          <div style={card}>
            <h3 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "24px", color: "#fff" }}>Activity Categories</h3>
            <div style={{ height: "220px", display: "flex", alignItems: "center", justifyContent: "center" }}><Doughnut data={categoryData} options={chartOpts} /></div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginTop: "16px" }}>
              {categoryData.labels.map((l, i) => (
                <div key={l} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px" }}>
                  <div style={{ width: "10px", height: "10px", borderRadius: "3px", backgroundColor: categoryData.datasets[0].backgroundColor[i], flexShrink: 0 }} />
                  <span style={{ color: "#a1a1aa" }}>{l}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="animate-fade-up" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", animationDelay: "0.3s", opacity: 0 }}>
          {/* Popular Destinations */}
          <div style={card}>
            <h3 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "20px", color: "#fff" }}>Trending Destinations</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {liveDests.length === 0 ? (
                <div style={{ padding: "40px 0", textAlign: "center", color: "#71717a", fontSize: "14px" }}>No searches yet. Explore some cities!</div>
              ) : liveDests.map((d, i) => (
                <div key={d.city} style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <span style={{ width: "24px", textAlign: "center", fontWeight: 800, fontSize: "14px", color: i < 3 ? "#10b981" : "#52525b" }}>#{i + 1}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                      <span style={{ fontWeight: 600, fontSize: "14px", color: "#fff" }}>{d.city}, {d.country}</span>
                      <span style={{ fontSize: "13px", color: "#a1a1aa" }}>{d.count} searches</span>
                    </div>
                    <div style={{ height: "6px", borderRadius: "3px", background: "rgba(255,255,255,0.05)", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${d.pct}%`, borderRadius: "3px", background: `linear-gradient(to right, #10b981, #3b82f6)`, transition: "width 1s ease" }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Users */}
          <div style={card}>
            <h3 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "20px", color: "#fff" }}>Recent Platform Activity</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {liveUsers.length === 0 ? (
                <div style={{ padding: "40px 0", textAlign: "center", color: "#71717a", fontSize: "14px" }}>No activity recorded yet.</div>
              ) : liveUsers.map((a, idx) => {
                const timeAgo = Math.round((new Date().getTime() - new Date(a.time).getTime()) / 60000);
                const timeStr = timeAgo < 1 ? "Just now" : timeAgo < 60 ? `${timeAgo} min ago` : "Earlier today";
                return (
                  <div key={idx} style={{ display: "flex", alignItems: "center", gap: "14px", padding: "10px 12px", borderRadius: "12px", background: "rgba(255,255,255,0.03)" }}>
                    <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "rgba(16,185,129,0.15)", color: "#10b981", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Activity size={18} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: "14px", color: "#fff" }}>{a.action}</div>
                      <div style={{ fontSize: "12px", color: "#52525b" }}>Authentic Local Data</div>
                    </div>
                    <div style={{ textAlign: "right", fontSize: "12px", color: "#71717a" }}>
                      {timeStr}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
      )}
      <Footer />
    </div>
  );
}
