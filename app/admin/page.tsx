"use client";

import { useState, useEffect } from "react";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Filler } from "chart.js";
import { Users, MapPin, TrendingUp, Eye, Globe, Activity, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Filler);

// CSS for fade-in animations
const fadeUpStyles = `
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-up { animation: fadeUp 0.6s ease-out forwards; }
`;

const citiesToTrack = [
  { city: "Paris", country: "France" },
  { city: "Tokyo", country: "Japan" },
  { city: "Bali", country: "Indonesia" },
  { city: "New York", country: "USA" },
  { city: "London", country: "UK" },
  { city: "Dubai", country: "UAE" }
];

export default function AdminPage() {
  const [timeRange, setTimeRange] = useState("7d");
  const [liveUsers, setLiveUsers] = useState<any[]>([]);
  const [liveDests, setLiveDests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [localStats, setLocalStats] = useState({
    activeTrips: 0,
    engagementCount: 0,
    hasUser: 0,
    totalExpenses: 0
  });
  
  const [catData, setCatData] = useState({
    sightseeing: 10,
    food: 8,
    hotels: 6,
    transport: 4
  });

  useEffect(() => {
    // Authentic recent actions
    try {
      const actions = JSON.parse(localStorage.getItem("appActions") || "[]");
      setLiveUsers(actions.slice(0, 5)); // We reuse liveUsers state for recent actions
    } catch {}

    // Authentic search history
    try {
      const history = JSON.parse(localStorage.getItem("searchHistory") || "[]");
      history.sort((a: any, b: any) => b.count - a.count);
      const maxCount = history[0]?.count || 1;
      setLiveDests(history.map((h: any) => ({ ...h, pct: Math.round((h.count / maxCount) * 100) })).slice(0, 6));
    } catch {}
    
    setLoading(false);

    // Read local usage data to make charts fully live and authentic
    const savedItinerary = localStorage.getItem("itinerary");
    const savedExpenses = localStorage.getItem("expenses");
    const currentUser = localStorage.getItem("currentUser");
    const tripDest = localStorage.getItem("tripDestination");
    
    let activeTripsCount = tripDest ? 1 : 0;
    let engagement = 0;
    let totalExpValue = 0;
    
    let ss = 0, fd = 0, ht = 0, tr = 0;
    
    if (savedItinerary) {
      try {
        const days = JSON.parse(savedItinerary);
        days.forEach((d: any) => {
          engagement += d.activities.length;
          // simplistic categorization of itinerary items
          d.activities.forEach((a: any) => {
            const name = a.name.toLowerCase();
            if (name.includes("museum") || name.includes("see") || name.includes("tour")) ss += 2;
            if (name.includes("eat") || name.includes("food") || name.includes("breakfast") || name.includes("lunch")) fd += 2;
          });
        });
        if (days.length > 0) activeTripsCount = 1;
      } catch {}
    }
    
    if (savedExpenses) {
      try {
        const expenses = JSON.parse(savedExpenses);
        engagement += expenses.length;
        expenses.forEach((e: any) => {
          totalExpValue += e.amount || 0;
          if (e.category === "Transport") tr += 3;
          if (e.category === "Stay") ht += 3;
          if (e.category === "Meals") fd += 3;
          if (e.category === "Activities") ss += 3;
        });
      } catch {}
    }
    
    setLocalStats({
      activeTrips: activeTripsCount,
      engagementCount: engagement,
      hasUser: currentUser || tripDest || engagement > 0 ? 1 : 0,
      totalExpenses: totalExpValue
    });
    setCatData({ sightseeing: ss, food: fd, hotels: ht, transport: tr });
  }, []);

  // Calculate Authentic Numbers (no mock base numbers)
  const totalUsersNum = localStats.hasUser;
  const activeTripsNum = localStats.activeTrips;
  const engagementNum = localStats.engagementCount;
  const totalExpensesNum = localStats.totalExpenses;

  const stats = [
    { label: "Active Users", value: totalUsersNum.toString(), change: "", icon: <Users size={22} />, color: "#3b82f6" },
    { label: "Saved Trips", value: activeTripsNum.toString(), change: "", icon: <Globe size={22} />, color: "#10b981" },
    { label: "Total Expenses", value: "$" + totalExpensesNum.toLocaleString(), change: "", icon: <Eye size={22} />, color: "#a855f7" },
    { label: "Activities Planned", value: engagementNum.toString(), change: "", icon: <Activity size={22} />, color: "#f59e0b" },
  ];

  // Dynamic user growth over the last 7 days ending today
  const generateDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      dates.push(d.toLocaleDateString('en-US', { weekday: 'short' }));
    }
    return dates;
  };

  const userGrowth = {
    labels: generateDates(),
    datasets: [{
      label: "Actions Taken",
      data: [0, 0, 0, 0, 0, 0, localStats.engagementCount], // authentic data for today
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

  // Authentic category distribution based purely on local app usage
  const categoryData = {
    labels: ["Sightseeing", "Food & Meals", "Hotels & Stays", "Transport"],
    datasets: [{
      data: [catData.sightseeing, catData.food, catData.hotels, catData.transport],
      backgroundColor: ["#3b82f6", "#f59e0b", "#a855f7", "#ef4444"],
      borderColor: "#09090b",
      borderWidth: 3,
    }],
  };

  const revenueData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May"],
    datasets: [{
      label: "Bookings",
      data: [1200, 1800, 2200, 1900, 2800],
      backgroundColor: "rgba(16,185,129,0.7)",
      borderColor: "#10b981",
      borderWidth: 2,
      borderRadius: 8,
      borderSkipped: false,
    }],
  };

  const chartOpts = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { backgroundColor: "#18181b", titleColor: "#fff", bodyColor: "#a1a1aa", borderColor: "rgba(255,255,255,0.1)", borderWidth: 1, padding: 12, cornerRadius: 12 } },
  };

  const lineOpts = { ...chartOpts, scales: { x: { ticks: { color: "#52525b" }, grid: { display: false }, border: { display: false } }, y: { ticks: { color: "#52525b" }, grid: { color: "rgba(255,255,255,0.04)" }, border: { display: false } } } };
  const barOpts = { ...lineOpts };

  const card: React.CSSProperties = { backgroundColor: "rgba(24,24,27,0.8)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "20px", padding: "28px", backdropFilter: "blur(12px)" };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#09090b", color: "#f4f4f5", fontFamily: "'Inter', sans-serif" }}>
      <style dangerouslySetInnerHTML={{ __html: fadeUpStyles }} />
      <Navbar />
      <main style={{ maxWidth: "1300px", margin: "0 auto", padding: "110px 24px 80px" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "32px", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <h1 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, marginBottom: "8px", background: "linear-gradient(to right, #fff, #71717a)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Admin Dashboard</h1>
            <p style={{ color: "#71717a", fontSize: "16px" }}>Monitor platform usage, engagement, and travel trends.</p>
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
                  <span style={{ fontSize: "13px", fontWeight: 700, color: "#10b981" }}>{s.change}</span>
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
    </div>
  );
}
