"use client";

import { useState, useEffect } from "react";
import { MapPin, Clock, Calendar, Copy, Check } from "lucide-react";
import { useParams } from "next/navigation";

interface Activity { id: number; time: string; name: string; notes: string }
interface Day { id: number; day: number; title: string; activities: Activity[] }

export default function SharedItinerary() {
  const params = useParams();
  const id = params.id as string;
  const [data, setData] = useState<{ dest: { city: string; country: string } | null; days: Day[] } | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(`shared_${id}`);
    if (stored) {
      try { setData(JSON.parse(stored)); } catch {}
    }
  }, [id]);

  const handleCopyTrip = () => {
    if (data) {
      localStorage.setItem("itinerary", JSON.stringify(data.days));
      if (data.dest) localStorage.setItem("tripDestination", JSON.stringify(data.dest));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!data) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#09090b", color: "#f4f4f5", fontFamily: "'Inter', sans-serif", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "64px", marginBottom: "20px" }}>🗺️</div>
          <h1 style={{ fontSize: "28px", fontWeight: 700, marginBottom: "12px" }}>Itinerary Not Found</h1>
          <p style={{ color: "#71717a", fontSize: "16px" }}>This shared itinerary link may have expired or is invalid.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#09090b", color: "#f4f4f5", fontFamily: "'Inter', sans-serif" }}>
      {/* Minimal Header */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, height: "70px", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 10%", background: "rgba(9,9,11,0.9)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(255,255,255,0.05)", zIndex: 1000 }}>
        <span style={{ fontSize: "1.3rem", fontWeight: 800, color: "#10b981", letterSpacing: "2px" }}>TRAVELO</span>
        <span style={{ color: "#71717a", fontSize: "14px" }}>Shared Itinerary</span>
      </nav>

      <main style={{ maxWidth: "800px", margin: "0 auto", padding: "100px 24px 80px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <div style={{ display: "inline-flex", padding: "8px 20px", borderRadius: "30px", background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)", color: "#10b981", fontSize: "14px", fontWeight: 600, marginBottom: "20px" }}>
            🌍 Shared Trip Plan
          </div>
          {data.dest && (
            <h1 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, color: "#fff", marginBottom: "10px" }}>
              Trip to {data.dest.city}
            </h1>
          )}
          {data.dest && <p style={{ color: "#a1a1aa", fontSize: "18px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}><MapPin size={18} style={{ color: "#10b981" }} />{data.dest.country}</p>}
          <button onClick={handleCopyTrip} style={{ marginTop: "24px", backgroundColor: copied ? "#10b981" : "rgba(255,255,255,0.08)", color: "#fff", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "14px", padding: "14px 28px", fontWeight: 700, fontSize: "15px", cursor: "pointer", fontFamily: "inherit", display: "inline-flex", alignItems: "center", gap: "8px", transition: "all 0.2s" }}>
            {copied ? <><Check size={18} /> Copied to My Trips!</> : <><Copy size={18} /> Copy This Trip</>}
          </button>
        </div>

        {/* Timeline */}
        <div style={{ position: "relative" }}>
          <div style={{ position: "absolute", left: "28px", top: "20px", bottom: "20px", width: "2px", background: "rgba(16,185,129,0.2)" }} />
          {data.days.map((day) => (
            <div key={day.id} style={{ position: "relative", paddingLeft: "70px", marginBottom: "32px" }}>
              {/* Day dot */}
              <div style={{ position: "absolute", left: "20px", top: "4px", width: "18px", height: "18px", borderRadius: "50%", backgroundColor: "#10b981", border: "3px solid #09090b" }} />
              <div style={{ backgroundColor: "rgba(24,24,27,0.8)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "20px", padding: "24px", backdropFilter: "blur(12px)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "18px" }}>
                  <span style={{ padding: "6px 14px", borderRadius: "10px", background: "rgba(16,185,129,0.15)", color: "#10b981", fontWeight: 800, fontSize: "13px" }}>Day {day.day}</span>
                  <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#fff", margin: 0 }}>{day.title}</h3>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {day.activities.map((act) => (
                    <div key={act.id} style={{ display: "flex", alignItems: "flex-start", gap: "14px", padding: "12px", borderRadius: "12px", background: "rgba(255,255,255,0.03)" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "5px", color: "#10b981", fontSize: "14px", fontWeight: 600, flexShrink: 0, paddingTop: "2px" }}>
                        <Clock size={14} /> {act.time}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: "15px", color: "#fff" }}>{act.name}</div>
                        {act.notes && <div style={{ fontSize: "13px", color: "#71717a", marginTop: "4px" }}>{act.notes}</div>}
                      </div>
                    </div>
                  ))}
                  {day.activities.length === 0 && <p style={{ color: "#3f3f46", fontSize: "14px", textAlign: "center", padding: "10px" }}>No activities planned</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
