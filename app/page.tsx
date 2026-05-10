"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";

interface CurrentUser {
  fullName?: string;
  email: string;
}

export default function Home() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("currentUser");
    if (!stored) {
      router.push("/login");
      return;
    }
    setCurrentUser(JSON.parse(stored));
    setLoading(false);
  }, [router]);



  if (loading) {
    return null; // Don't render until auth check is done
  }

  const displayName = currentUser?.fullName || currentUser?.email || "User";

  return (
    <div className="home-body">
      {/* NAVBAR */}
      <Navbar />

      {/* STATS BAR */}
      <section className="extra-features">
        <div className="feature-bar">
          <div className="stat-item">
            <h4>120+</h4>
            <p>Destinations</p>
          </div>
          <div className="stat-item">
            <h4>24/7</h4>
            <p>Concierge</p>
          </div>
          <div className="stat-item">
            <h4>100%</h4>
            <p>Secure Payments</p>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <main className="home-container">
        <header className="hero-section">
          <h2>Welcome, {displayName}</h2>
          <p>
            Premium travel experiences designed for the modern adventurer.
          </p>
        </header>

        <section className="triple-layout">
          {/* Card 1 */}
          <div className="glass-card">
            <span className="card-icon">🏔️</span>
            <h3>Mountains</h3>
            <p>
              Escape to the peaks with our exclusive hiking and resort
              packages.
            </p>
            <a href="#" className="card-link">
              View Details
            </a>
          </div>

          {/* Card 2 */}
          <div className="glass-card">
            <span className="card-icon">🏝️</span>
            <h3>Islands</h3>
            <p>
              Crystal clear waters and private villas waiting for your
              arrival.
            </p>
            <a href="#" className="card-link">
              View Details
            </a>
          </div>

          {/* Card 3 */}
          <div className="glass-card">
            <span className="card-icon">🏙️</span>
            <h3>Cities</h3>
            <p>
              Immerse yourself in the culture and lights of the world&apos;s
              greatest metros.
            </p>
            <a href="#" className="card-link">
              View Details
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
