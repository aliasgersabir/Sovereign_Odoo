"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Compass,
  Briefcase,
  DollarSign,
  CalendarDays,
  BarChart3,
  ChevronDown,
  User,
  Settings,
  LogOut,
  BookOpen,
} from "lucide-react";

interface CurrentUser {
  fullName?: string;
  email: string;
}

export default function Navbar() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [dropdownActive, setDropdownActive] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("currentUser");
    if (stored) {
      setCurrentUser(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

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

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    localStorage.removeItem("currentUser");
    router.push("/login");
  };

  if (loading) {
    return <nav className="navbar"><div className="logo">ODYSEA</div></nav>;
  }

  const displayName = currentUser?.fullName || currentUser?.email || "User";
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    displayName
  )}&background=10b981&color=fff`;

  return (
    <nav className="navbar">
      <Link href="/" className="logo" style={{ textDecoration: 'none', color: '#10b981', fontWeight: 800, fontSize: '1.5rem', letterSpacing: '2px' }}>
        ODYSEA
      </Link>
      <div className="nav-links">
        {currentUser && (
          <>
            <Link href="/discover">
              <Compass className="lucide-icon" /> Explore
            </Link>
            <Link href="/budget">
              <DollarSign className="lucide-icon" /> Budget
            </Link>
            <Link href="/itinerary">
              <CalendarDays className="lucide-icon" /> Itinerary
            </Link>
            <Link href="/journal">
              <BookOpen className="lucide-icon" /> Journal
            </Link>
            <Link href="/admin">
              <BarChart3 className="lucide-icon" /> Admin
            </Link>
          </>
        )}

        {currentUser ? (
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
              <Link href="/edit-profile">
                <User className="lucide-icon" /> Edit Profile
              </Link>
              <a href="#">
                <Settings className="lucide-icon" /> Settings
              </a>
              <hr />
              <a href="#" className="logout" onClick={handleLogout}>
                <LogOut className="lucide-icon" /> Logout
              </a>
            </div>
          </div>
        ) : (
          <Link href="/login" style={{ display: "inline-block", background: "#10b981", color: "#000", padding: "8px 20px", borderRadius: "100px", fontWeight: 700, textDecoration: "none", marginLeft: "10px" }}>
            Log In
          </Link>
        )}
      </div>
    </nav>
  );
}
