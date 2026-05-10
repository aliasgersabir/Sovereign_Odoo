"use client";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CalendarProps {
  selected: string;
  minDate?: string;
  onSelect: (date: string) => void;
  onClose: () => void;
}

export default function Calendar({ selected, minDate, onSelect, onClose }: CalendarProps) {
  const today = new Date();
  const [viewMonth, setViewMonth] = useState(selected ? new Date(selected + "T00:00:00").getMonth() : today.getMonth());
  const [viewYear, setViewYear] = useState(selected ? new Date(selected + "T00:00:00").getFullYear() : today.getFullYear());

  const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const days = ["Su","Mo","Tu","We","Th","Fr","Sa"];

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(viewYear - 1); }
    else setViewMonth(viewMonth - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(viewYear + 1); }
    else setViewMonth(viewMonth + 1);
  };

  const isDisabled = (day: number) => {
    const d = new Date(viewYear, viewMonth, day);
    const min = minDate ? new Date(minDate + "T00:00:00") : today;
    min.setHours(0,0,0,0);
    return d < min;
  };

  const isSelected = (day: number) => {
    if (!selected) return false;
    const s = new Date(selected + "T00:00:00");
    return s.getDate() === day && s.getMonth() === viewMonth && s.getFullYear() === viewYear;
  };

  const isToday = (day: number) => {
    return today.getDate() === day && today.getMonth() === viewMonth && today.getFullYear() === viewYear;
  };

  const handleSelect = (day: number) => {
    if (isDisabled(day)) return;
    const m = String(viewMonth + 1).padStart(2, "0");
    const d = String(day).padStart(2, "0");
    onSelect(`${viewYear}-${m}-${d}`);
  };

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let i = 1; i <= daysInMonth; i++) cells.push(i);

  return (
    <div style={{
      position: "absolute", top: "calc(100% + 16px)", left: "50%", transform: "translateX(-50%)",
      zIndex: 200, background: "#1c1c1f", border: "1px solid rgba(255,255,255,0.12)",
      borderRadius: "20px", padding: "20px", width: "320px",
      boxShadow: "0 30px 60px rgba(0,0,0,0.7)", fontFamily: "inherit",
    }} onClick={(e) => e.stopPropagation()}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <button onClick={prevMonth} style={{ background: "rgba(255,255,255,0.06)", border: "none", borderRadius: "10px", padding: "8px", cursor: "pointer", color: "#fff", display: "flex" }}>
          <ChevronLeft size={18} />
        </button>
        <span style={{ fontWeight: 700, fontSize: "16px", color: "#fff" }}>{months[viewMonth]} {viewYear}</span>
        <button onClick={nextMonth} style={{ background: "rgba(255,255,255,0.06)", border: "none", borderRadius: "10px", padding: "8px", cursor: "pointer", color: "#fff", display: "flex" }}>
          <ChevronRight size={18} />
        </button>
      </div>
      {/* Day names */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "4px", marginBottom: "8px" }}>
        {days.map((d) => (
          <div key={d} style={{ textAlign: "center", fontSize: "12px", fontWeight: 600, color: "#71717a", padding: "4px 0" }}>{d}</div>
        ))}
      </div>
      {/* Day cells */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "4px" }}>
        {cells.map((day, i) => (
          <div key={i} onClick={() => day && handleSelect(day)} style={{
            textAlign: "center", padding: "10px 0", borderRadius: "12px", fontSize: "14px", fontWeight: 500,
            cursor: day && !isDisabled(day) ? "pointer" : "default",
            color: !day ? "transparent" : isDisabled(day) ? "#3f3f46" : isSelected(day) ? "#000" : isToday(day) ? "#10b981" : "#e4e4e7",
            background: isSelected(day!) ? "#10b981" : "transparent",
            transition: "background 0.15s",
          }}
            onMouseEnter={(e) => { if (day && !isDisabled(day) && !isSelected(day)) e.currentTarget.style.background = "rgba(255,255,255,0.08)"; }}
            onMouseLeave={(e) => { if (!isSelected(day!)) e.currentTarget.style.background = "transparent"; }}
          >
            {day || ""}
          </div>
        ))}
      </div>
    </div>
  );
}
