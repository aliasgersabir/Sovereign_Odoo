"use client";

import { useState, useEffect, useRef } from "react";
import { Search, MapPin, Loader2, Calendar as CalIcon, Star } from "lucide-react";
import Navbar from "@/components/Navbar";
import Calendar from "@/components/Calendar";

interface Suggestion {
  place_id: number;
  display_name: string;
  name: string;
  address: { city?: string; town?: string; country?: string; state?: string; country_code?: string };
}

// Strategy 1: Wikipedia page summary (best for city names)
async function fetchFromWikipedia(query: string): Promise<string> {
  try {
    const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`);
    if (!res.ok) return "";
    const data = await res.json();
    return data.originalimage?.source || data.thumbnail?.source || "";
  } catch { return ""; }
}

// Strategy 2: Wikimedia Commons search (namespace 6 = files only)
async function fetchFromCommons(query: string): Promise<string> {
  try {
    const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrnamespace=6&gsrlimit=3&prop=imageinfo&iiprop=url|thumburl&iiurlwidth=800&format=json&origin=*`;
    const res = await fetch(url);
    if (!res.ok) return "";
    const data = await res.json();
    const pages = data.query?.pages;
    if (!pages) return "";
    for (const key of Object.keys(pages)) {
      const info = pages[key]?.imageinfo?.[0];
      if (info?.thumburl) return info.thumburl;
      if (info?.url && !info.url.endsWith(".svg")) return info.url;
    }
  } catch { /* ignore */ }
  return "";
}

// Combined fetcher: tries multiple strategies to get the most accurate and beautiful images
async function fetchCityImage(city: string, country: string, category: "landmark" | "food" | "hotel" | "city" = "city"): Promise<string> {
  // Strategy 1: Specific category search on Wikipedia
  const categoryQuery = category === "food" ? `${city} cuisine` : category === "hotel" ? `Hotels in ${city}` : `${city} ${category}`;
  const catWiki = await fetchFromWikipedia(categoryQuery);
  if (catWiki && !catWiki.includes("Flag") && !catWiki.includes("Map")) return catWiki;

  // Strategy 2: Direct city search as fallback for city/landmark
  if (category === "city" || category === "landmark") {
    const cityWiki = await fetchFromWikipedia(city);
    if (cityWiki && !cityWiki.includes("Flag") && !cityWiki.includes("Map")) return cityWiki;
  }

  // Strategy 3: Wikimedia Commons search
  const commons = await fetchFromCommons(`${city} ${category} sightseeing`);
  if (commons) return commons;

  // GUARANTEED FALLBACK: High-quality, relevant photos from LoremFlickr using specific tags
  const tags = category === "food" ? "food,restaurant" : category === "hotel" ? "hotel,bedroom" : "landmark,cityscape";
  return `https://loremflickr.com/1200/800/${encodeURIComponent(city)},${tags},travel/all`;
}

export default function DiscoverPage() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCity, setSelectedCity] = useState<Suggestion | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [showCal, setShowCal] = useState<"in" | "out" | null>(null);
  const [cityImg, setCityImg] = useState("");
  const [currSym, setCurrSym] = useState("$");
  const [exRate, setExRate] = useState(1);

  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.length < 3) { setSuggestions([]); return; }
    setLoading(true);
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?city=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=5`);
        setSuggestions(await res.json());
      } catch { /* ignore */ }
      setLoading(false);
    }, 500);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsFocused(false);
        setShowCal(null);
      }
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const handleSelect = async (city: Suggestion) => {
    const name = city.name || city.address.city || city.address.town || city.display_name.split(",")[0];
    setSelectedCity(city);
    setQuery(name);
    setSuggestions([]);
    setIsFocused(false);
    const countryName = city.address.country || "";
    const img = await fetchCityImage(name, countryName, "city");
    setCityImg(img);

    // Fetch currency using country_code (works for all languages: jp, fr, in, etc.)
    const countryCode = city.address.country_code;
    if (countryCode) {
      try {
        const res = await fetch(`https://restcountries.com/v3.1/alpha/${countryCode.toUpperCase()}?fields=currencies,name`);
        if (res.ok) {
          const data = await res.json();
          const currencies = data?.currencies;
          const englishName = data?.name?.common || countryName;
          if (currencies) {
            const code = Object.keys(currencies)[0];
            const symbol = currencies[code]?.symbol || code;
            localStorage.setItem("tripDestination", JSON.stringify({ city: name, country: englishName, currencyCode: code, currencySymbol: symbol, image: img }));
            
            // Track search for authentic admin dashboard data
            try {
              const searches = JSON.parse(localStorage.getItem("searchHistory") || "[]");
              const existing = searches.find((s: any) => s.city === name);
              if (existing) { existing.count += 1; } 
              else { searches.push({ city: name, country: englishName, count: 1 }); }
              localStorage.setItem("searchHistory", JSON.stringify(searches));
              
              // Log activity
              const acts = JSON.parse(localStorage.getItem("appActions") || "[]");
              acts.unshift({ action: `Searched for ${name}, ${englishName}`, time: new Date().toISOString() });
              if (acts.length > 20) acts.pop();
              localStorage.setItem("appActions", JSON.stringify(acts));
            } catch {}

            setCurrSym(symbol);
            // Fetch live exchange rate
            try {
              const rateRes = await fetch(`https://open.er-api.com/v6/latest/USD`);
              if (rateRes.ok) {
                const rateData = await rateRes.json();
                const rate = rateData.rates?.[code];
                if (rate) setExRate(rate);
              }
            } catch {}
          }
        }
      } catch { /* ignore */ }
    }
  };

  const fmt = (d: string) => d ? new Date(d + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "";
  const today = new Date().toISOString().split("T")[0];
  const cityName = selectedCity ? (selectedCity.name || selectedCity.address.city || "") : "";

  // Common label style
  const labelStyle: React.CSSProperties = { display: "block", fontSize: "12px", fontWeight: 700, color: "#a1a1aa", letterSpacing: "1.5px", marginBottom: "6px", textTransform: "uppercase" };
  const valStyle = (has: boolean): React.CSSProperties => ({ fontSize: "17px", fontWeight: 500, color: has ? "#fff" : "#52525b", display: "flex", alignItems: "center", gap: "10px" });

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#09090b", color: "#f4f4f5", fontFamily: "'Inter', sans-serif", display: "flex", flexDirection: "column" }}>
      <Navbar />

      {/* HERO */}
      <section style={{ position: "relative", width: "100%", height: "80vh", minHeight: "620px", display: "flex", alignItems: "center", justifyContent: "center", paddingTop: "80px" }}>
        <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
          <img src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, #09090b 0%, rgba(0,0,0,0.7) 50%, rgba(0,0,0,0.45) 100%)" }} />
        </div>

        <div style={{ position: "relative", zIndex: 10, width: "100%", maxWidth: "1000px", padding: "0 24px", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <h1 style={{ fontSize: "clamp(2.5rem, 5vw, 4.2rem)", fontWeight: 800, color: "#fff", marginBottom: "14px", textAlign: "center", lineHeight: 1.1 }}>Discover your next adventure</h1>
          <p style={{ fontSize: "clamp(1rem, 2vw, 1.25rem)", color: "rgba(255,255,255,0.7)", marginBottom: "48px", textAlign: "center", maxWidth: "550px", lineHeight: 1.6 }}>Search any city on Earth. Plan your perfect trip.</p>

          {/* SEARCH BAR */}
          <div ref={searchRef} style={{ width: "100%", maxWidth: "860px", backgroundColor: "rgba(24,24,27,0.85)", backdropFilter: "blur(24px)", border: (isFocused || showCal) ? "1px solid rgba(16,185,129,0.5)" : "1px solid rgba(255,255,255,0.1)", borderRadius: "60px", display: "flex", alignItems: "stretch", boxShadow: "0 20px 60px rgba(0,0,0,0.5)", transition: "all 0.3s", position: "relative" }}>

            {/* WHERE */}
            <div style={{ flex: "1.5", padding: "20px 30px", position: "relative", borderRadius: "60px 0 0 60px" }}>
              <label style={labelStyle}>Where</label>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <MapPin size={18} style={{ color: "#10b981", flexShrink: 0 }} />
                <input type="text" placeholder="Search destinations..." value={query}
                  onChange={(e) => setQuery(e.target.value)} onFocus={() => { setIsFocused(true); setShowCal(null); }}
                  style={{ width: "100%", background: "transparent", border: "none", outline: "none", color: "#fff", fontSize: "17px", fontWeight: 500, fontFamily: "inherit" }} />
                {loading && <Loader2 size={18} style={{ color: "#10b981", animation: "spin 1s linear infinite" }} />}
              </div>

              {/* Dropdown */}
              {isFocused && query.length > 0 && (
                <div style={{ position: "absolute", top: "calc(100% + 12px)", left: 0, width: "400px", maxWidth: "90vw", background: "#1c1c1f", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "20px", boxShadow: "0 25px 50px rgba(0,0,0,0.6)", overflow: "hidden", zIndex: 100 }}>
                  {loading && <div style={{ padding: "20px", textAlign: "center", color: "#10b981", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}><Loader2 size={20} style={{ animation: "spin 1s linear infinite" }} /> Searching...</div>}
                  {!loading && suggestions.length > 0 && (
                    <ul style={{ listStyle: "none", padding: "6px 0", margin: 0 }}>
                      {suggestions.map((s) => (
                        <li key={s.place_id} onClick={() => handleSelect(s)}
                          style={{ padding: "14px 22px", cursor: "pointer", display: "flex", alignItems: "center", gap: "14px", borderBottom: "1px solid rgba(255,255,255,0.04)", transition: "background 0.15s" }}
                          onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
                          onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                          <div style={{ backgroundColor: "rgba(16,185,129,0.15)", padding: "10px", borderRadius: "14px", display: "flex" }}><MapPin size={20} style={{ color: "#10b981" }} /></div>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: "15px", color: "#fff" }}>{s.name || s.address.city || s.address.town}</div>
                            <div style={{ fontSize: "13px", color: "#71717a", marginTop: "2px" }}>{[s.address.state, s.address.country].filter(Boolean).join(", ")}</div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                  {!loading && query.length >= 3 && suggestions.length === 0 && <div style={{ padding: "20px", textAlign: "center", color: "#71717a" }}>No destinations found.</div>}
                </div>
              )}
            </div>

            <div style={{ width: "1px", background: "rgba(255,255,255,0.08)", margin: "14px 0" }} />

            {/* CHECK-IN */}
            <div style={{ flex: "1", padding: "20px 24px", cursor: "pointer", position: "relative" }} onClick={() => { setShowCal("in"); setIsFocused(false); }}>
              <label style={labelStyle}>Check in</label>
              <div style={valStyle(!!checkIn)}>
                <CalIcon size={18} style={{ color: "#10b981", flexShrink: 0 }} />
                {checkIn ? fmt(checkIn) : "Add date"}
              </div>
              {showCal === "in" && <Calendar selected={checkIn} minDate={today} onSelect={(d) => { setCheckIn(d); setShowCal("out"); }} onClose={() => setShowCal(null)} />}
            </div>

            <div style={{ width: "1px", background: "rgba(255,255,255,0.08)", margin: "14px 0" }} />

            {/* CHECK-OUT + SEARCH */}
            <div style={{ flex: "1.2", padding: "20px 12px 20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", borderRadius: "0 60px 60px 0", cursor: "pointer", position: "relative" }} onClick={() => { setShowCal("out"); setIsFocused(false); }}>
              <div>
                <label style={labelStyle}>Check out</label>
                <div style={valStyle(!!checkOut)}>
                  <CalIcon size={18} style={{ color: "#10b981", flexShrink: 0 }} />
                  {checkOut ? fmt(checkOut) : "Add date"}
                </div>
                {showCal === "out" && <Calendar selected={checkOut} minDate={checkIn || today} onSelect={(d) => { setCheckOut(d); setShowCal(null); }} onClose={() => setShowCal(null)} />}
              </div>
              <button onClick={(e) => e.stopPropagation()} style={{ backgroundColor: "#10b981", color: "#000", border: "none", borderRadius: "50px", padding: "14px 24px", display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontWeight: 700, fontSize: "15px", fontFamily: "inherit", transition: "transform 0.2s", boxShadow: "0 8px 24px rgba(16,185,129,0.25)" }}
                onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}>
                <Search size={20} /> Search
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* RESULTS */}
      <main style={{ width: "100%", maxWidth: "1200px", margin: "0 auto", padding: "0 24px 80px" }}>
        {selectedCity && (
          <div>
            {/* City Hero Banner */}
            <div style={{ position: "relative", width: "100%", height: "380px", borderRadius: "24px", overflow: "hidden", marginBottom: "40px", border: "1px solid rgba(255,255,255,0.08)" }}>
              {cityImg ? (
                <img src={cityImg} alt={cityName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, #18181b 0%, #27272a 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "80px" }}>🌍</div>
              )}
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 60%)" }} />
              <div style={{ position: "absolute", bottom: "36px", left: "36px" }}>
                <h2 style={{ fontSize: "44px", fontWeight: 800, color: "#fff", margin: 0, lineHeight: 1.1 }}>{cityName}</h2>
                <p style={{ fontSize: "18px", color: "rgba(255,255,255,0.65)", marginTop: "8px", display: "flex", alignItems: "center", gap: "8px" }}>
                  <MapPin size={18} style={{ color: "#10b981" }} />
                  {[selectedCity.address.state, selectedCity.address.country].filter(Boolean).join(", ")}
                </p>
                {(checkIn || checkOut) && (
                  <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.45)", marginTop: "6px", display: "flex", alignItems: "center", gap: "8px" }}>
                    <CalIcon size={15} style={{ color: "#10b981" }} />
                    {checkIn ? fmt(checkIn) : "—"} → {checkOut ? fmt(checkOut) : "—"}
                  </p>
                )}
              </div>
            </div>

            {/* Activities */}
            <h3 style={{ fontSize: "26px", fontWeight: 700, color: "#fff", marginBottom: "24px" }}>Things to do in {cityName}</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "24px" }}>
              {[
                { title: "Guided Sightseeing Tour", desc: "Explore the historic landmarks and iconic views", baseUSD: 89, rating: "4.9", suffix: "person", category: "landmark", googleQ: `sightseeing tours in ${cityName}` },
                { title: "Authentic Culinary Experience", desc: "Taste the local flavors with expert food guides", baseUSD: 65, rating: "4.8", suffix: "person", category: "food", googleQ: `food tours in ${cityName}` },
                { title: "Premium Boutique Stays", desc: "Top rated luxury accommodations", baseUSD: 150, rating: "5.0", suffix: "night", category: "hotel", googleQ: `best hotels in ${cityName}` },
              ].map((item, i) => (
                <ActivityCard key={i} {...item} cityName={cityName} countryName={selectedCity.address.country || ""} currSym={currSym} exRate={exRate} />
              ))}
            </div>
          </div>
        )}
      </main>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function ActivityCard({ title, desc, baseUSD, rating, suffix, category, googleQ, currSym, exRate, cityName, countryName }: { title: string; desc: string; baseUSD: number; rating: string; suffix: string; category: any; googleQ: string; currSym: string; exRate: number; cityName: string; countryName: string }) {
  const [img, setImg] = useState("");
  const [imgLoading, setImgLoading] = useState(true);

  useEffect(() => {
    setImgLoading(true);
    fetchCityImage(cityName, countryName, category).then((url) => {
      setImg(url);
      setImgLoading(false);
    });
  }, [category, cityName, countryName]);

  const convertedPrice = Math.round(baseUSD * exRate);
  const googleUrl = `https://www.google.com/search?q=${encodeURIComponent(googleQ)}`;

  return (
    <a href={googleUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", color: "inherit" }}>
      <div style={{ backgroundColor: "rgba(24,24,27,0.9)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "20px", overflow: "hidden", cursor: "pointer", transition: "transform 0.3s, border-color 0.3s", height: "100%" }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.borderColor = "rgba(16,185,129,0.4)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}>
        <div style={{ width: "100%", height: "200px", overflow: "hidden", position: "relative", background: "#27272a" }}>
          {imgLoading ? (
            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #18181b, #27272a)" }}>
              <Loader2 size={28} style={{ color: "#10b981", animation: "spin 1s linear infinite" }} />
            </div>
          ) : img ? (
            <img src={img} alt={title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, #18181b 0%, #10b981 200%)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "48px" }}>
              {title.includes("Sightseeing") ? "📸" : title.includes("Culinary") ? "🍽️" : "🏨"}
            </div>
          )}
          <div style={{ position: "absolute", top: "12px", right: "12px", background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)", padding: "5px 12px", borderRadius: "20px", display: "flex", alignItems: "center", gap: "5px", fontSize: "13px", fontWeight: 700, color: "#fff", border: "1px solid rgba(255,255,255,0.1)" }}>
            <Star size={13} style={{ color: "#10b981", fill: "#10b981" }} /> {rating}
          </div>
        </div>
        <div style={{ padding: "20px" }}>
          <h4 style={{ fontSize: "18px", fontWeight: 700, color: "#fff", margin: "0 0 6px 0" }}>{title}</h4>
          <p style={{ fontSize: "14px", color: "#a1a1aa", margin: "0 0 14px 0", lineHeight: 1.5 }}>{desc}</p>
          <p style={{ fontSize: "17px", fontWeight: 700, color: "#fff", margin: 0 }}>
            From {currSym}{convertedPrice.toLocaleString()} <span style={{ color: "#71717a", fontWeight: 400, fontSize: "14px" }}>/ {suffix}</span>
          </p>
        </div>
      </div>
    </a>
  );
}
