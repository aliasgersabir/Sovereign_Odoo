"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Compass,
  DollarSign,
  CalendarDays,
  BarChart3,
  ChevronDown,
  User,
  LogOut,
  Menu,
  X,
  BookOpen,
  Settings,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function Navbar() {
  const { loading, displayName, logout, currentUser } = useAuth();
  const avatarUrl = "https://ui-avatars.com/api/?name=" + encodeURIComponent(displayName || "User") + "&background=10b981&color=fff";
  const [dropdownActive, setDropdownActive] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const dropdown = document.querySelector(".profile-dropdown");
      if (dropdown && !dropdown.contains(e.target as Node)) {
        setDropdownActive(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, []);

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    logout();
  };

  if (loading) {
    return <nav className="navbar"><div className="logo" style={{ color: '#10b981', fontWeight: 800 }}>ODYSEA</div></nav>;
  }

  return (
    <>
      <nav className="navbar">
        <Link href="/" className="logo" style={{ textDecoration: 'none', color: '#10b981', fontWeight: 800, fontSize: '1.5rem', letterSpacing: '2px' }}>
          ODYSEA
        </Link>

        {/* Mobile Toggle */}
        <button
          className="mobile-toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div className={`nav-links ${mobileOpen ? "open" : ""}`}>
          {currentUser && (
            <>
              <Link href="/discover" onClick={() => setMobileOpen(false)}>
                <Compass className="lucide-icon" /> Explore
              </Link>
              <Link href="/budget" onClick={() => setMobileOpen(false)}>
                <DollarSign className="lucide-icon" /> Budget
              </Link>
              <Link href="/itinerary" onClick={() => setMobileOpen(false)}>
                <CalendarDays className="lucide-icon" /> Itinerary
              </Link>
              <Link href="/journal" onClick={() => setMobileOpen(false)}>
                <BookOpen className="lucide-icon" /> Journal
              </Link>
              <Link href="/admin" onClick={() => setMobileOpen(false)} className="mobile-only-link">
                <BarChart3 className="lucide-icon" /> Admin
              </Link>
            </>
          )}

          <div className={`profile-dropdown ${dropdownActive ? "active" : ""}`}>
            <div
              className="profile-trigger"
              onClick={(e) => {
                e.stopPropagation();
                setDropdownActive(!dropdownActive);
              }}
            >
              <img src={avatarUrl} alt="Profile" className="avatar" />
              <span>{displayName}</span>
              <ChevronDown className="lucide-icon" />
            </div>
            <div className="dropdown-content">
              <Link href="/edit-profile" onClick={() => setMobileOpen(false)}>
                <User className="lucide-icon" /> Edit Profile
              </Link>
              <a href="#" onClick={(e) => e.preventDefault()}>
                <Settings className="lucide-icon" /> Settings
              </a>
              <Link href="/admin" onClick={() => setMobileOpen(false)}>
                <BarChart3 className="lucide-icon" /> Admin Dashboard
              </Link>
              <hr />
              <button className="logout" onClick={handleLogout} style={{ background: "none", border: "none", cursor: "pointer", color: "inherit", font: "inherit", display: "flex", alignItems: "center", gap: "8px", padding: "12px 20px", width: "100%" }}>
                <LogOut className="lucide-icon" /> Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="mobile-overlay" onClick={() => setMobileOpen(false)} />
      )}
    </>
  );
}
