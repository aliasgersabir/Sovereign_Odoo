"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";

export default function Home() {
  const { loading, displayName } = useAuth();

  if (loading) {
    return null; // Don't render until auth check is done
  }

  return (
    <div className="home-body">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes revealUp {
          0% { opacity: 0; transform: translateY(40px) scale(0.95); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-reveal { opacity: 0; animation: revealUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-400 { animation-delay: 0.4s; }
        .delay-500 { animation-delay: 0.5s; }
        
        @keyframes pulseGlow {
          0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
          70% { box-shadow: 0 0 0 15px rgba(16, 185, 129, 0); }
          100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }
        .cta-btn {
          animation: pulseGlow 2s infinite;
          transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .cta-btn:hover {
          transform: scale(1.05) translateY(-2px);
          background: #34d399 !important;
        }
      `}} />
      {/* NAVBAR */}
      <Navbar />

      {/* STATS BAR */}
      <section className="extra-features animate-reveal delay-200">
        <div className="feature-bar" style={{ background: 'linear-gradient(145deg, rgba(24,24,27,0.8), rgba(9,9,11,0.9))', borderTop: '2px solid rgba(16,185,129,0.3)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
          <div className="stat-item">
            <h4 style={{ textShadow: '0 0 15px rgba(16,185,129,0.5)' }}>120+</h4>
            <p>Destinations</p>
          </div>
          <div className="stat-item">
            <h4 style={{ textShadow: '0 0 15px rgba(16,185,129,0.5)' }}>24/7</h4>
            <p>Concierge</p>
          </div>
          <div className="stat-item">
            <h4 style={{ textShadow: '0 0 15px rgba(16,185,129,0.5)' }}>100%</h4>
            <p>Secure Payments</p>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <main className="home-container">
        <header className="hero-section animate-reveal">
          <h2 style={{ background: 'linear-gradient(to right, #ffffff, #10b981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', filter: 'drop-shadow(0 0 20px rgba(16,185,129,0.2))' }}>
            Welcome, {displayName}
          </h2>
          <p style={{ maxWidth: '600px', margin: '0 auto' }}>
            Premium travel experiences designed for the modern adventurer.
          </p>
        </header>

        <section className="triple-layout animate-reveal delay-300">
          {/* Card 1 */}
          <div className="glass-card" style={{ position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '-50%', left: '-50%', width: '200%', height: '200%', background: 'radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 50%)', opacity: 0.5, pointerEvents: 'none' }} />
            <span className="card-icon" style={{ filter: 'drop-shadow(0 10px 10px rgba(0,0,0,0.5))' }}>🏔️</span>
            <h3>Mountains</h3>
            <p>Escape to the peaks with our exclusive hiking and resort packages.</p>
            <Link href="/discover" className="card-link">View Details</Link>
          </div>

          {/* Card 2 */}
          <div className="glass-card delay-100" style={{ position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '-50%', left: '-50%', width: '200%', height: '200%', background: 'radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 50%)', opacity: 0.5, pointerEvents: 'none' }} />
            <span className="card-icon" style={{ filter: 'drop-shadow(0 10px 10px rgba(0,0,0,0.5))' }}>🏝️</span>
            <h3>Islands</h3>
            <p>Crystal clear waters and private villas waiting for your arrival.</p>
            <Link href="/discover" className="card-link">View Details</Link>
          </div>

          {/* Card 3 */}
          <div className="glass-card delay-200" style={{ position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '-50%', left: '-50%', width: '200%', height: '200%', background: 'radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 50%)', opacity: 0.5, pointerEvents: 'none' }} />
            <span className="card-icon" style={{ filter: 'drop-shadow(0 10px 10px rgba(0,0,0,0.5))' }}>🏙️</span>
            <h3>Cities</h3>
            <p>Immerse yourself in the culture and lights of the world&apos;s greatest metros.</p>
            <Link href="/discover" className="card-link">View Details</Link>
          </div>
        </section>

        {/* TESTIMONIALS SECTION */}
        <section className="animate-reveal delay-400" style={{ marginTop: '80px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '40px', background: 'linear-gradient(to right, #fff, #a1a1aa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>What Our Travelers Say</h2>
          <div className="triple-layout">
            <div className="glass-card">
              <div style={{ fontSize: '2rem', marginBottom: '10px', filter: 'drop-shadow(0 0 10px rgba(250,204,21,0.5))' }}>⭐️⭐️⭐️⭐️⭐️</div>
              <p style={{ fontStyle: 'italic', marginBottom: '20px' }}>"Traveloop made planning my Europe trip effortless. The shared itineraries are a game changer!"</p>
              <h4 style={{ color: '#10b981' }}>- Sarah J.</h4>
            </div>
            <div className="glass-card">
              <div style={{ fontSize: '2rem', marginBottom: '10px', filter: 'drop-shadow(0 0 10px rgba(250,204,21,0.5))' }}>⭐️⭐️⭐️⭐️⭐️</div>
              <p style={{ fontStyle: 'italic', marginBottom: '20px' }}>"The budget tool kept me perfectly on track during my month in Southeast Asia. Highly recommend."</p>
              <h4 style={{ color: '#10b981' }}>- Michael T.</h4>
            </div>
            <div className="glass-card">
              <div style={{ fontSize: '2rem', marginBottom: '10px', filter: 'drop-shadow(0 0 10px rgba(250,204,21,0.5))' }}>⭐️⭐️⭐️⭐️⭐️</div>
              <p style={{ fontStyle: 'italic', marginBottom: '20px' }}>"Beautiful interface, super responsive, and genuine travel recommendations. A must-have app."</p>
              <h4 style={{ color: '#10b981' }}>- Elena R.</h4>
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="animate-reveal delay-500" style={{ marginTop: '80px', marginBottom: '40px', padding: '60px 20px', background: 'linear-gradient(135deg, rgba(16,185,129,0.15) 0%, rgba(9,9,11,1) 100%)', borderRadius: '24px', border: '1px solid rgba(16,185,129,0.3)', textAlign: 'center', boxShadow: '0 20px 50px rgba(0,0,0,0.5), inset 0 0 40px rgba(16,185,129,0.1)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '2px', background: 'linear-gradient(90deg, transparent, #10b981, transparent)', opacity: 0.8 }} />
          <h2 style={{ fontSize: '2.5rem', marginBottom: '20px', color: '#fff' }}>Ready for Your Next Adventure?</h2>
          <p style={{ fontSize: '1.2rem', color: '#a1a1aa', marginBottom: '30px', maxWidth: '600px', margin: '0 auto 30px' }}>Join thousands of modern explorers who plan, budget, and experience the world with Traveloop.</p>
          <Link href="/signup" className="cta-btn" style={{ display: 'inline-block', padding: '16px 40px', background: 'linear-gradient(135deg, #10b981, #059669)', color: '#000', fontWeight: 'bold', borderRadius: '14px', fontSize: '1.1rem', textDecoration: 'none' }}>Start Planning Free</Link>
        </section>
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
