"use client";

import { useState, useEffect } from "react";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import {
  DollarSign,
  PlusCircle,
  Trash2,
  TrendingUp,
  Plane,
  Home,
  Utensils,
  Compass,
} from "lucide-react";
import Navbar from "@/components/Navbar";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

interface Expense {
  id: number;
  category: "Transport" | "Stay" | "Meals" | "Activities";
  label: string;
  amount: number;
}

const categoryColors: Record<string, string> = {
  Transport: "#3b82f6",
  Stay: "#a855f7",
  Meals: "#f59e0b",
  Activities: "#10b981",
};

const categoryIcons: Record<string, React.ReactNode> = {
  Transport: <Plane size={18} />,
  Stay: <Home size={18} />,
  Meals: <Utensils size={18} />,
  Activities: <Compass size={18} />,
};

const defaultExpenses: Expense[] = [
  { id: 1, category: "Transport", label: "Flight tickets", amount: 450 },
  { id: 2, category: "Transport", label: "Local transit pass", amount: 35 },
  { id: 3, category: "Stay", label: "Hotel (5 nights)", amount: 600 },
  { id: 4, category: "Meals", label: "Daily food budget", amount: 250 },
  { id: 5, category: "Meals", label: "Fine dining", amount: 120 },
  { id: 6, category: "Activities", label: "City sightseeing tour", amount: 89 },
  { id: 7, category: "Activities", label: "Museum passes", amount: 45 },
];

export default function BudgetPage() {
  const [expenses, setExpenses] = useState<Expense[]>(defaultExpenses);
  const [newLabel, setNewLabel] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [newCategory, setNewCategory] = useState<Expense["category"]>("Transport");
  const [totalBudgetStr, setTotalBudgetStr] = useState("2000");
  const [sym, setSym] = useState("$");
  const [code, setCode] = useState("USD");
  const [dest, setDest] = useState<{city:string;country:string;image?:string}|null>(null);

  useEffect(() => {
    const s = localStorage.getItem("tripDestination");
    if (s) {
      try {
        const d = JSON.parse(s);
        setSym(d.currencySymbol || "$");
        setCode(d.currencyCode || "USD");
        setDest({ city: d.city, country: d.country, image: d.image });
      } catch {}
    }
    
    const savedExp = localStorage.getItem("expenses");
    if (savedExp) {
      try { setExpenses(JSON.parse(savedExp)); } catch {}
    }
    const savedBud = localStorage.getItem("totalBudgetStr");
    if (savedBud) setTotalBudgetStr(savedBud);
  }, []);

  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem("totalBudgetStr", totalBudgetStr);
  }, [totalBudgetStr]);

  const addExpense = () => {
    if (!newLabel.trim() || !newAmount) return;
    setExpenses([
      ...expenses,
      { id: Date.now(), category: newCategory, label: newLabel.trim(), amount: parseFloat(newAmount) },
    ]);
    setNewLabel("");
    setNewAmount("");
  };

  const removeExpense = (id: number) => setExpenses(expenses.filter((e) => e.id !== id));

  // Category totals
  const categories = ["Transport", "Stay", "Meals", "Activities"] as const;
  const categoryTotals = categories.map((cat) =>
    expenses.filter((e) => e.category === cat).reduce((sum, e) => sum + e.amount, 0)
  );
  const totalBudget = parseFloat(totalBudgetStr) || 0;
  const totalSpent = categoryTotals.reduce((a, b) => a + b, 0);
  const remaining = totalBudget - totalSpent;

  // Chart data
  const pieData = {
    labels: [...categories],
    datasets: [
      {
        data: categoryTotals,
        backgroundColor: categories.map((c) => categoryColors[c]),
        borderColor: "#09090b",
        borderWidth: 3,
        hoverOffset: 8,
      },
    ],
  };

  const barData = {
    labels: [...categories],
    datasets: [
      {
        label: `Spent (${sym})`,
        data: categoryTotals,
        backgroundColor: categories.map((c) => categoryColors[c] + "cc"),
        borderColor: categories.map((c) => categoryColors[c]),
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#18181b",
        titleColor: "#fff",
        bodyColor: "#a1a1aa",
        borderColor: "rgba(255,255,255,0.1)",
        borderWidth: 1,
        padding: 12,
        cornerRadius: 12,
      },
    },
  };

  const barOptions = {
    ...chartOptions,
    scales: {
      x: {
        ticks: { color: "#71717a", font: { size: 13, weight: 600 as const } },
        grid: { display: false },
        border: { display: false },
      },
      y: {
        ticks: { color: "#71717a", font: { size: 12 }, callback: (v: unknown) => sym + v },
        grid: { color: "rgba(255,255,255,0.04)" },
        border: { display: false },
      },
    },
  };

  // Styles
  const card: React.CSSProperties = {
    backgroundColor: "rgba(24,24,27,0.8)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "20px",
    padding: "28px",
    backdropFilter: "blur(12px)",
  };

  const inputStyle: React.CSSProperties = {
    background: "rgba(39,39,42,0.5)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "12px",
    color: "#fff",
    padding: "12px 16px",
    fontSize: "15px",
    outline: "none",
    fontFamily: "inherit",
    width: "100%",
    transition: "border-color 0.2s",
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#09090b", color: "#f4f4f5", fontFamily: "'Inter', sans-serif" }}>
      <Navbar />

      {/* Destination Hero Image */}
      {dest?.image && (
        <div style={{ position: "relative", height: "300px", overflow: "hidden", marginTop: "60px" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundImage: `url(${dest.image})`, backgroundSize: "cover", backgroundPosition: "center", filter: "brightness(0.4) contrast(1.1)" }} />
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "linear-gradient(to bottom, transparent, #09090b)" }} />
          <div style={{ position: "absolute", bottom: "30px", left: "24px", textAlign: "left" }}>
             <h2 style={{ fontSize: "clamp(1.5rem, 4vw, 3rem)", fontWeight: 800, textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}>{dest.city} Budget</h2>
             <p style={{ fontSize: "1rem", opacity: 0.7, textTransform: "uppercase", letterSpacing: "1px" }}>{dest.country}</p>
          </div>
        </div>
      )}

      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: dest?.image ? "40px 24px 80px" : "110px 24px 80px" }}>
        {/* Header */}
        <div style={{ marginBottom: "40px" }}>
          <h1 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, marginBottom: "8px", background: "linear-gradient(to right, #fff, #71717a)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Budget Breakdown
          </h1>
          <p style={{ color: "#a1a1aa", fontSize: "18px" }}>
            {dest ? (<>Trip to <span style={{ color: "#10b981", fontWeight: 600 }}>{dest.city}, {dest.country}</span> — Currency: <span style={{ color: "#10b981", fontWeight: 600 }}>{sym} ({code})</span></>) : (<>Track your trip expenses. <span style={{ color: "#71717a" }}>Search a city on Explore to set local currency.</span></>)}
          </p>
        </div>

        {/* Summary Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px", marginBottom: "32px" }}>
          {/* Total Budget */}
          <div style={{ ...card, display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ padding: "14px", borderRadius: "16px", background: "rgba(16,185,129,0.15)", color: "#10b981", display: "flex" }}>
              <DollarSign size={24} />
            </div>
            <div>
              <div style={{ fontSize: "13px", color: "#71717a", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "4px" }}>Total Budget</div>
              <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <span style={{ fontSize: "28px", fontWeight: 800, color: "#fff" }}>{sym}</span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={totalBudgetStr}
                  onChange={(e) => {
                    const v = e.target.value.replace(/[^0-9.]/g, "");
                    setTotalBudgetStr(v);
                  }}
                  placeholder="0"
                  style={{ background: "transparent", border: "none", borderBottom: "2px solid rgba(255,255,255,0.15)", outline: "none", color: "#fff", fontSize: "28px", fontWeight: 800, width: "140px", fontFamily: "inherit", padding: "2px 0" }}
                />
              </div>
            </div>
          </div>
          {/* Total Spent */}
          <div style={{ ...card, display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ padding: "14px", borderRadius: "16px", background: "rgba(245,158,11,0.15)", color: "#f59e0b", display: "flex" }}>
              <TrendingUp size={24} />
            </div>
            <div>
              <div style={{ fontSize: "13px", color: "#71717a", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "4px" }}>Total Spent</div>
              <div style={{ fontSize: "28px", fontWeight: 800, color: "#fff" }}>{sym}{totalSpent}</div>
            </div>
          </div>
          {/* Remaining */}
          <div style={{ ...card, display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ padding: "14px", borderRadius: "16px", background: remaining >= 0 ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)", color: remaining >= 0 ? "#10b981" : "#ef4444", display: "flex" }}>
              <DollarSign size={24} />
            </div>
            <div>
              <div style={{ fontSize: "13px", color: "#71717a", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "4px" }}>Remaining</div>
              <div style={{ fontSize: "28px", fontWeight: 800, color: remaining >= 0 ? "#10b981" : "#ef4444" }}>{sym}{remaining}</div>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "24px", marginBottom: "32px" }}>
          {/* Pie Chart */}
          <div style={card}>
            <h3 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "24px", color: "#fff" }}>Spending Distribution</h3>
            <div style={{ height: "280px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Pie data={pieData} options={{ ...chartOptions, plugins: { ...chartOptions.plugins, legend: { display: false } } }} />
            </div>
            {/* Custom Legend */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginTop: "20px" }}>
              {categories.map((cat, i) => (
                <div key={cat} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ width: "12px", height: "12px", borderRadius: "4px", backgroundColor: categoryColors[cat], flexShrink: 0 }} />
                  <span style={{ fontSize: "14px", color: "#a1a1aa" }}>{cat}</span>
                  <span style={{ fontSize: "14px", fontWeight: 700, color: "#fff", marginLeft: "auto" }}>{sym}{categoryTotals[i]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bar Chart */}
          <div style={card}>
            <h3 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "24px", color: "#fff" }}>Cost by Category</h3>
            <div style={{ height: "350px" }}>
              <Bar data={barData} options={barOptions} />
            </div>
          </div>
        </div>

        {/* Add Expense + Expense List */}
        <div style={{ display: "grid", gridTemplateColumns: "380px 1fr", gap: "24px" }}>
          {/* Add Expense Form */}
          <div style={card}>
            <h3 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "20px", color: "#fff" }}>Add Expense</h3>

            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#a1a1aa", marginBottom: "6px" }}>Category</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as Expense["category"])}
                style={{ ...inputStyle, cursor: "pointer", appearance: "none" }}
              >
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#a1a1aa", marginBottom: "6px" }}>Description</label>
              <input
                type="text"
                placeholder="e.g., Taxi to airport"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#a1a1aa", marginBottom: "6px" }}>Amount ({sym})</label>
              <input
                type="number"
                placeholder="0.00"
                value={newAmount}
                onChange={(e) => setNewAmount(e.target.value)}
                style={inputStyle}
              />
            </div>

            <button
              onClick={addExpense}
              style={{
                width: "100%", padding: "14px", backgroundColor: "#10b981", color: "#000", border: "none", borderRadius: "12px",
                fontWeight: 700, fontSize: "15px", cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center",
                justifyContent: "center", gap: "8px", transition: "transform 0.2s, box-shadow 0.2s",
                boxShadow: "0 8px 24px rgba(16,185,129,0.25)",
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
            >
              <PlusCircle size={18} /> Add Expense
            </button>
          </div>

          {/* Expense List */}
          <div style={card}>
            <h3 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "20px", color: "#fff" }}>All Expenses</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "400px", overflowY: "auto" }}>
              {expenses.length === 0 && (
                <p style={{ color: "#71717a", textAlign: "center", padding: "40px 0" }}>No expenses yet. Add one to get started.</p>
              )}
              {expenses.map((exp) => (
                <div
                  key={exp.id}
                  style={{
                    display: "flex", alignItems: "center", gap: "14px", padding: "14px 16px",
                    borderRadius: "14px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.06)"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.03)"}
                >
                  <div style={{ padding: "10px", borderRadius: "12px", backgroundColor: categoryColors[exp.category] + "20", color: categoryColors[exp.category], display: "flex" }}>
                    {categoryIcons[exp.category]}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: "15px", color: "#fff" }}>{exp.label}</div>
                    <div style={{ fontSize: "13px", color: "#71717a" }}>{exp.category}</div>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: "16px", color: "#fff", marginRight: "8px" }}>{sym}{exp.amount}</div>
                  <button
                    onClick={() => removeExpense(exp.id)}
                    style={{ background: "none", border: "none", color: "#52525b", cursor: "pointer", padding: "6px", borderRadius: "8px", display: "flex", transition: "color 0.2s" }}
                    onMouseEnter={(e) => e.currentTarget.style.color = "#ef4444"}
                    onMouseLeave={(e) => e.currentTarget.style.color = "#52525b"}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
