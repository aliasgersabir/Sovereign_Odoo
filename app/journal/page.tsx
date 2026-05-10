"use client";

import { useState, useEffect, useRef } from "react";
import { Search, MapPin, Loader2, Plus, Trash2, Calendar as CalIcon, Image as ImageIcon, BookOpen, X } from "lucide-react";
import Navbar from "@/components/Navbar";

interface JournalEntry {
  id: number;
  title: string;
  date: string;
  location: string;
  country: string;
  content: string;
  image: string;
}

interface Suggestion {
  place_id: number;
  display_name: string;
  name: string;
  address: { city?: string; town?: string; country?: string; state?: string; country_code?: string };
}

export default function JournalPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    date: new Date().toISOString().split("T")[0],
    location: "",
    country: "",
    content: "",
    image: ""
  });

  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("travelJournal");
    if (saved) {
      try { setEntries(JSON.parse(saved)); } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("travelJournal", JSON.stringify(entries));
  }, [entries]);

  // reused location search logic
  useEffect(() => {
    if (query.length < 3) { setSuggestions([]); return; }
    setIsSearching(true);
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?city=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=5`);
        setSuggestions(await res.json());
      } catch { /* ignore */ }
      setIsSearching(false);
    }, 500);
    return () => clearTimeout(t);
  }, [query]);

  const handleAddEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.location) return;
    
    const newEntry: JournalEntry = {
      id: Date.now(),
      ...formData
    };
    
    setEntries([newEntry, ...entries]);
    setShowModal(false);
    setFormData({ title: "", date: new Date().toISOString().split("T")[0], location: "", country: "", content: "", image: "" });
    setQuery("");

    // Log activity for Admin Dashboard
    try {
      const acts = JSON.parse(localStorage.getItem("appActions") || "[]");
      acts.unshift({ action: `Added journal entry: ${formData.title}`, time: new Date().toISOString() });
      if (acts.length > 20) acts.pop();
      localStorage.setItem("appActions", JSON.stringify(acts));
    } catch {}
  };

  const deleteEntry = (id: number) => {
    setEntries(entries.filter(e => e.id !== id));
  };

  const cardStyle: React.CSSProperties = { backgroundColor: "rgba(24,24,27,0.8)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "20px", padding: "24px", backdropFilter: "blur(12px)", position: "relative", overflow: "hidden" };
  const inputStyle: React.CSSProperties = { width: "100%", backgroundColor: "rgba(39,39,42,0.6)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", padding: "12px 16px", color: "#fff", outline: "none", fontSize: "15px", fontFamily: "inherit" };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#09090b", color: "#f4f4f5", fontFamily: "'Inter', sans-serif" }}>
      <Navbar />
      
      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "110px 24px 80px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px" }}>
          <div>
            <h1 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, background: "linear-gradient(to right, #fff, #71717a)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              My Travel Journal
            </h1>
            <p style={{ color: "#a1a1aa", fontSize: "18px", marginTop: "4px" }}>Document your adventures and memories</p>
          </div>
          <button onClick={() => setShowModal(true)} style={{ backgroundColor: "#10b981", color: "#000", border: "none", borderRadius: "14px", padding: "14px 28px", fontWeight: 700, fontSize: "15px", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", boxShadow: "0 8px 24px rgba(16,185,129,0.25)", transition: "transform 0.2s" }}
            onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}>
            <Plus size={20} /> New Entry
          </button>
        </div>

        {entries.length === 0 ? (
          <div style={{ textAlign: "center", padding: "100px 20px", border: "2px dashed rgba(255,255,255,0.05)", borderRadius: "32px" }}>
            <div style={{ width: "80px", height: "80px", backgroundColor: "rgba(16,185,129,0.1)", color: "#10b981", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
              <BookOpen size={40} />
            </div>
            <h2 style={{ fontSize: "24px", fontWeight: 700, marginBottom: "8px" }}>No entries yet</h2>
            <p style={{ color: "#71717a", fontSize: "16px", maxWidth: "400px", margin: "0 auto" }}>Your journal is empty. Click the "New Entry" button to start recording your journey.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "24px" }}>
            {entries.map(entry => (
              <div key={entry.id} style={cardStyle}>
                {entry.image && (
                  <div style={{ width: "calc(100% + 48px)", margin: "-24px -24px 20px -24px", height: "200px", overflow: "hidden" }}>
                    <img src={entry.image} alt={entry.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <h3 style={{ fontSize: "20px", fontWeight: 700, margin: "0 0 8px 0" }}>{entry.title}</h3>
                  <button onClick={() => deleteEntry(entry.id)} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", padding: "4px" }} title="Delete entry">
                    <Trash2 size={18} />
                  </button>
                </div>
                <div style={{ display: "flex", gap: "12px", fontSize: "13px", color: "#a1a1aa", marginBottom: "16px" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><CalIcon size={14} /> {entry.date}</span>
                  <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><MapPin size={14} /> {entry.location}, {entry.country}</span>
                </div>
                <p style={{ fontSize: "15px", color: "#d4d4d8", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{entry.content}</p>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* New Entry Modal */}
      {showModal && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.8)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "20px" }}>
          <div style={{ backgroundColor: "#18181b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "24px", width: "100%", maxWidth: "600px", maxHeight: "90vh", overflowY: "auto", position: "relative" }}>
            <div style={{ padding: "32px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                <h2 style={{ fontSize: "24px", fontWeight: 800 }}>Create New Entry</h2>
                <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", color: "#71717a", cursor: "pointer" }}><X size={24} /></button>
              </div>
              
              <form onSubmit={handleAddEntry} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "14px", fontWeight: 600, color: "#a1a1aa", marginBottom: "8px" }}>Title</label>
                  <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Give your memory a title..." style={inputStyle} required />
                </div>
                
                <div style={{ display: "flex", gap: "16px" }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: "block", fontSize: "14px", fontWeight: 600, color: "#a1a1aa", marginBottom: "8px" }}>Date</label>
                    <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} style={inputStyle} />
                  </div>
                  <div style={{ flex: 1, position: "relative" }} ref={searchRef}>
                    <label style={{ display: "block", fontSize: "14px", fontWeight: 600, color: "#a1a1aa", marginBottom: "8px" }}>Location</label>
                    <div style={{ position: "relative" }}>
                      <input type="text" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search city..." style={inputStyle} required />
                      {isSearching && <Loader2 size={16} style={{ position: "absolute", right: "12px", top: "12px", color: "#10b981", animation: "spin 1s linear infinite" }} />}
                    </div>
                    {suggestions.length > 0 && (
                      <div style={{ position: "absolute", top: "100%", left: 0, right: 0, backgroundColor: "#27272a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", marginTop: "8px", zIndex: 10, overflow: "hidden", boxShadow: "0 10px 25px rgba(0,0,0,0.5)" }}>
                        {suggestions.map(s => (
                          <div key={s.place_id} onClick={() => {
                            const name = s.name || s.address.city || s.address.town || s.display_name.split(",")[0];
                            setFormData({...formData, location: name, country: s.address.country || ""});
                            setQuery(`${name}, ${s.address.country || ""}`);
                            setSuggestions([]);
                          }} style={{ padding: "12px 16px", cursor: "pointer", borderBottom: "1px solid rgba(255,255,255,0.05)", transition: "background 0.2s" }}
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)"}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}>
                            <div style={{ fontSize: "14px", fontWeight: 600 }}>{s.name || s.display_name.split(",")[0]}</div>
                            <div style={{ fontSize: "12px", color: "#71717a" }}>{s.address.country}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "14px", fontWeight: 600, color: "#a1a1aa", marginBottom: "8px" }}>Story</label>
                  <textarea rows={5} value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} placeholder="What happened on this journey?..." style={{ ...inputStyle, resize: "vertical" }} required />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "14px", fontWeight: 600, color: "#a1a1aa", marginBottom: "8px" }}>Image URL (Optional)</label>
                  <div style={{ position: "relative" }}>
                    <input type="text" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} placeholder="https://images.unsplash.com/..." style={inputStyle} />
                    <ImageIcon size={18} style={{ position: "absolute", right: "12px", top: "12px", color: "#71717a" }} />
                  </div>
                </div>

                <button type="submit" style={{ backgroundColor: "#10b981", color: "#000", border: "none", borderRadius: "14px", padding: "16px", fontWeight: 800, fontSize: "16px", cursor: "pointer", marginTop: "12px", boxShadow: "0 8px 24px rgba(16,185,129,0.25)" }}>
                  Save Entry
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
