"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Share2, Copy, Check, MapPin, Calendar, Clock, GripVertical, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";

interface ItineraryDay {
  id: number;
  day: number;
  title: string;
  activities: { id: number; time: string; name: string; notes: string }[];
}

export default function ItineraryPage() {
  const [days, setDays] = useState<ItineraryDay[]>([
    { id: 1, day: 1, title: "Arrival & Explore", activities: [
      { id: 1, time: "09:00", name: "Airport pickup", notes: "Terminal 3" },
      { id: 2, time: "12:00", name: "Check-in at hotel", notes: "" },
      { id: 3, time: "15:00", name: "City walking tour", notes: "Meet at main square" },
    ]},
    { id: 2, day: 2, title: "Sightseeing Day", activities: [
      { id: 4, time: "08:00", name: "Breakfast at local café", notes: "" },
      { id: 5, time: "10:00", name: "Museum visit", notes: "Book tickets in advance" },
      { id: 6, time: "14:00", name: "Lunch & free time", notes: "" },
    ]},
  ]);
  const [dest, setDest] = useState<{ city: string; country: string } | null>(null);
  const [shareUrl, setShareUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let currentDest = null;
    const s = localStorage.getItem("tripDestination");
    if (s) {
      try { 
        currentDest = JSON.parse(s);
        setDest(currentDest); 
      } catch {}
    }
    
    const saved = localStorage.getItem("itinerary");
    if (saved) {
      try { setDays(JSON.parse(saved)); return; } catch {}
    }

    // If no saved itinerary but we have a destination, fetch real attractions
    if (currentDest) {
      setLoading(true);
      const query = `[out:json][timeout:10];area["name"~"${currentDest.city}"]->.searchArea;node["tourism"="museum"](area.searchArea);out 3;node["tourism"="viewpoint"](area.searchArea);out 3;`;
      
      fetch("https://overpass-api.de/api/interpreter", {
        method: "POST",
        body: query
      })
      .then(r => r.json())
      .then(data => {
        const elements = data.elements || [];
        const museums = elements.filter((e: any) => e.tags?.tourism === "museum" && e.tags?.name).slice(0, 3);
        const viewpoints = elements.filter((e: any) => e.tags?.tourism === "viewpoint" && e.tags?.name).slice(0, 3);
        
        if (museums.length > 0 || viewpoints.length > 0) {
          const newDays = [];
          if (museums.length > 0) {
            newDays.push({
              id: 1, day: 1, title: `Culture in ${currentDest.city}`, activities: [
                { id: 1, time: "09:00", name: "Arrive and check-in", notes: "" },
                ...museums.map((m: any, i: number) => ({ id: 10+i, time: `${11 + i*3}:00`, name: `Visit ${m.tags.name}`, notes: m.tags.website || "Check ticket availability" }))
              ]
            });
          }
          if (viewpoints.length > 0) {
            newDays.push({
              id: 2, day: 2, title: "Sightseeing & Views", activities: [
                ...viewpoints.map((v: any, i: number) => ({ id: 20+i, time: `${10 + i*4}:00`, name: `See ${v.tags.name}`, notes: "Great photo spot!" }))
              ]
            });
          }
          // Only replace if we got 2 days worth, else keep default and mix
          if (newDays.length > 0) setDays(newDays);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("itinerary", JSON.stringify(days));
  }, [days]);

  const addDay = () => {
    const newDay = days.length + 1;
    setDays([...days, { id: Date.now(), day: newDay, title: `Day ${newDay}`, activities: [] }]);
  };

  const removeDay = (id: number) => {
    setDays(days.filter((d) => d.id !== id).map((d, i) => ({ ...d, day: i + 1 })));
  };

  const updateDayTitle = (id: number, title: string) => {
    setDays(days.map((d) => (d.id === id ? { ...d, title } : d)));
  };

  const addActivity = (dayId: number) => {
    setDays(days.map((d) => d.id === dayId ? { ...d, activities: [...d.activities, { id: Date.now(), time: "12:00", name: "", notes: "" }] } : d));
  };

  const updateActivity = (dayId: number, actId: number, field: string, value: string) => {
    setDays(days.map((d) => d.id === dayId ? { ...d, activities: d.activities.map((a) => a.id === actId ? { ...a, [field]: value } : a) } : d));
  };

  const removeActivity = (dayId: number, actId: number) => {
    setDays(days.map((d) => d.id === dayId ? { ...d, activities: d.activities.filter((a) => a.id !== actId) } : d));
  };

  const handleShare = () => {
    const encoded = btoa(encodeURIComponent(JSON.stringify({ dest, days })));
    const url = `${window.location.origin}/itinerary/${encoded.slice(0, 12)}`;
    // Store full data with the short key
    localStorage.setItem(`shared_${encoded.slice(0, 12)}`, JSON.stringify({ dest, days }));
    setShareUrl(url);
    setShowShare(true);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const card: React.CSSProperties = { backgroundColor: "rgba(24,24,27,0.8)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "20px", padding: "28px", backdropFilter: "blur(12px)" };
  const inputS: React.CSSProperties = { background: "rgba(39,39,42,0.5)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", color: "#fff", padding: "10px 14px", fontSize: "14px", outline: "none", fontFamily: "inherit", width: "100%" };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#09090b", color: "#f4f4f5", fontFamily: "'Inter', sans-serif" }}>
      <Navbar />
      <main style={{ maxWidth: "1000px", margin: "0 auto", padding: "110px 24px 80px" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "40px", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <h1 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, marginBottom: "8px", background: "linear-gradient(to right, #fff, #71717a)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Trip Itinerary
            </h1>
            {dest && (
              <p style={{ color: "#a1a1aa", fontSize: "18px", display: "flex", alignItems: "center", gap: "8px" }}>
                <MapPin size={18} style={{ color: "#10b981" }} /> {dest.city}, {dest.country}
              </p>
            )}
          </div>
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            {loading && <div style={{ color: "#10b981", display: "flex", alignItems: "center", gap: "6px", fontSize: "14px" }}><Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> Fetching local attractions...</div>}
            <button onClick={handleShare} style={{ backgroundColor: "#10b981", color: "#000", border: "none", borderRadius: "14px", padding: "14px 24px", fontWeight: 700, fontSize: "15px", cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: "8px", boxShadow: "0 8px 24px rgba(16,185,129,0.25)", transition: "transform 0.2s" }}
              onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}>
              <Share2 size={18} /> Share Itinerary
            </button>
          </div>
        </div>

        {/* Share Modal */}
        {showShare && (
          <div style={{ ...card, marginBottom: "24px", border: "1px solid rgba(16,185,129,0.3)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#10b981" }}>Shareable Link Generated!</h3>
              <button onClick={() => setShowShare(false)} style={{ background: "none", border: "none", color: "#71717a", cursor: "pointer", fontSize: "18px" }}>✕</button>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <input readOnly value={shareUrl} style={{ ...inputS, flex: 1, color: "#a1a1aa" }} />
              <button onClick={handleCopy} style={{ backgroundColor: copied ? "#10b981" : "rgba(255,255,255,0.1)", color: "#fff", border: "none", borderRadius: "10px", padding: "10px 20px", cursor: "pointer", fontFamily: "inherit", fontWeight: 600, display: "flex", alignItems: "center", gap: "6px", transition: "all 0.2s" }}>
                {copied ? <><Check size={16} /> Copied!</> : <><Copy size={16} /> Copy</>}
              </button>
            </div>
          </div>
        )}

        {/* Days */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {days.map((day) => (
            <div key={day.id} style={card}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <div style={{ padding: "10px 16px", borderRadius: "14px", background: "rgba(16,185,129,0.15)", color: "#10b981", fontWeight: 800, fontSize: "16px" }}>
                    Day {day.day}
                  </div>
                  <input value={day.title} onChange={(e) => updateDayTitle(day.id, e.target.value)}
                    style={{ background: "transparent", border: "none", outline: "none", color: "#fff", fontSize: "20px", fontWeight: 700, fontFamily: "inherit", width: "300px" }} />
                </div>
                <button onClick={() => removeDay(day.id)} style={{ background: "none", border: "none", color: "#52525b", cursor: "pointer", padding: "8px", borderRadius: "8px", display: "flex", transition: "color 0.2s" }}
                  onMouseEnter={(e) => e.currentTarget.style.color = "#ef4444"} onMouseLeave={(e) => e.currentTarget.style.color = "#52525b"}>
                  <Trash2 size={18} />
                </button>
              </div>

              {/* Activities */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px" }}>
                {day.activities.map((act) => (
                  <div key={act.id} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 14px", borderRadius: "12px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)", transition: "background 0.15s" }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.06)"} onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.03)"}>
                    <GripVertical size={16} style={{ color: "#3f3f46", flexShrink: 0 }} />
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }}>
                      <Clock size={14} style={{ color: "#10b981" }} />
                      <input type="time" value={act.time} onChange={(e) => updateActivity(day.id, act.id, "time", e.target.value)}
                        style={{ background: "transparent", border: "none", outline: "none", color: "#10b981", fontSize: "14px", fontWeight: 600, fontFamily: "inherit", width: "75px", colorScheme: "dark" }} />
                    </div>
                    <input value={act.name} placeholder="Activity name..." onChange={(e) => updateActivity(day.id, act.id, "name", e.target.value)}
                      style={{ background: "transparent", border: "none", outline: "none", color: "#fff", fontSize: "15px", fontWeight: 500, fontFamily: "inherit", flex: 1 }} />
                    <input value={act.notes} placeholder="Notes..." onChange={(e) => updateActivity(day.id, act.id, "notes", e.target.value)}
                      style={{ background: "transparent", border: "none", outline: "none", color: "#71717a", fontSize: "13px", fontFamily: "inherit", width: "150px" }} />
                    <button onClick={() => removeActivity(day.id, act.id)} style={{ background: "none", border: "none", color: "#3f3f46", cursor: "pointer", padding: "4px", display: "flex", transition: "color 0.2s" }}
                      onMouseEnter={(e) => e.currentTarget.style.color = "#ef4444"} onMouseLeave={(e) => e.currentTarget.style.color = "#3f3f46"}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>

              <button onClick={() => addActivity(day.id)} style={{ background: "rgba(255,255,255,0.05)", border: "1px dashed rgba(255,255,255,0.1)", borderRadius: "12px", padding: "10px", width: "100%", color: "#71717a", cursor: "pointer", fontFamily: "inherit", fontSize: "14px", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", transition: "all 0.2s" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#10b981"; e.currentTarget.style.color = "#10b981"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "#71717a"; }}>
                <Plus size={16} /> Add Activity
              </button>
            </div>
          ))}
        </div>

        {/* Add Day */}
        <button onClick={addDay} style={{ marginTop: "24px", background: "rgba(16,185,129,0.1)", border: "2px dashed rgba(16,185,129,0.3)", borderRadius: "20px", padding: "20px", width: "100%", color: "#10b981", cursor: "pointer", fontFamily: "inherit", fontSize: "16px", fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", transition: "all 0.2s" }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#10b981"; e.currentTarget.style.background = "rgba(16,185,129,0.15)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(16,185,129,0.3)"; e.currentTarget.style.background = "rgba(16,185,129,0.1)"; }}>
          <Plus size={20} /> Add Day {days.length + 1}
        </button>
      </main>
    </div>
  );
}
