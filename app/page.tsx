"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { Compass, Globe2, ArrowRight, ChevronDown, MapPin, Mountain, Waves, Building2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const sections = [
  {
    id: "mountains",
    title: "The Majestic Peaks",
    description: "Experience the serenity of the high altitudes. From the snow-capped Swiss Alps to the rugged beauty of the Himalayas.",
    places: "Swiss Alps, Himalayas, Patagonia",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=2000",
    icon: <Mountain size={48} />,
    color: "#3b82f6"
  },
  {
    id: "beaches",
    title: "Crystal Horizons",
    description: "Find your paradise where the turquoise waters meet pristine white sands. A haven of peace and tropical warmth.",
    places: "Maldives, Bora Bora, Amalfi Coast",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=2000",
    icon: <Waves size={48} />,
    color: "#10b981"
  },
  {
    id: "cities",
    title: "Urban Heartbeats",
    description: "Immerse yourself in the vibrant energy of the world's most iconic metropolises. Where culture, history, and modern life collide.",
    places: "Tokyo, Paris, New York City",
    image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&q=80&w=2000",
    icon: <Building2 size={48} />,
    color: "#a855f7"
  }
];

export default function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!scrollRef.current) return;

    const ctx = gsap.context(() => {
      const horizontalSections = gsap.utils.toArray(".scrolly-section");
      
      // Pinning the main container and creating a vertical-to-horizontal scroll feel
      // or just a stacked scroll with fades. Let's go with stacked fades for a cleaner Apple feel.
      
      horizontalSections.forEach((section: any, i) => {
        const content = section.querySelector(".section-content");
        const bg = section.querySelector(".section-bg");
        
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=100%",
            scrub: 1,
            pin: true,
            anticipatePin: 1,
          }
        });

        tl.fromTo(bg, 
          { scale: 1.2, filter: "brightness(0.3) blur(10px)" },
          { scale: 1, filter: "brightness(0.5) blur(0px)", duration: 1 }
        );

        tl.fromTo(content,
          { y: 100, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5 },
          "-=0.5"
        );
        
        if (i < horizontalSections.length - 1) {
          tl.to(content, { y: -100, opacity: 0, duration: 0.5, delay: 0.5 });
          tl.to(bg, { opacity: 0, duration: 0.5 }, "-=0.5");
        }
      });
    }, scrollRef);

    return () => ctx.revert();
  }, []);

  return (
    <div style={{ backgroundColor: "#000", color: "#fff", overflowX: "hidden" }}>
      <Navbar />

      <main ref={scrollRef}>
        {/* Initial Hero Section */}
        <section style={{ height: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative", textAlign: "center", padding: "0 20px" }}>
          <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
            <video autoPlay loop muted playsInline style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.4 }}>
              <source src="https://assets.mixkit.co/videos/preview/mixkit-flying-over-a-snowy-mountain-range-43340-large.mp4" type="video/mp4" />
            </video>
          </div>
          
          <div style={{ position: "relative", zIndex: 2 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "8px 16px", background: "rgba(255,255,255,0.1)", backdropFilter: "blur(10px)", borderRadius: "100px", marginBottom: "24px", border: "1px solid rgba(255,255,255,0.2)" }}>
              <span style={{ display: "inline-block", width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#10b981", boxShadow: "0 0 10px #10b981" }} />
              <span style={{ fontSize: "13px", fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase" }}>Odyssey Beyond Boundaries</span>
            </div>
            <h1 style={{ fontSize: "clamp(3.5rem, 8vw, 7rem)", fontWeight: 900, lineHeight: 1, marginBottom: "20px", letterSpacing: "-2px" }}>
              Journey Into <br />
              <span style={{ background: "linear-gradient(to right, #10b981, #3b82f6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>The Extraordinary.</span>
            </h1>
            <p style={{ fontSize: "20px", color: "#a1a1aa", maxWidth: "600px", margin: "0 auto 40px", lineHeight: 1.6 }}>
              Odysea crafts cinematic travel experiences tailored to your wildest dreams. Discover the world like never before.
            </p>
            <div style={{ display: "flex", gap: "16px", justifyContent: "center" }}>
              <Link href="/login" style={{ background: "#fff", color: "#000", padding: "18px 36px", borderRadius: "100px", fontWeight: 800, textDecoration: "none", fontSize: "18px" }}>
                Start Your Journey
              </Link>
            </div>
          </div>
          
          <div style={{ position: "absolute", bottom: "40px", left: "50%", transform: "translateX(-50%)", animation: "bounce 2s infinite", color: "#71717a" }}>
            <ChevronDown size={32} />
          </div>
        </section>

        {/* Scrollytelling Sections */}
        {sections.map((section) => (
          <section key={section.id} className="scrolly-section" style={{ height: "100vh", position: "relative", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
            <div className="section-bg" style={{ position: "absolute", inset: 0, backgroundImage: `url(${section.image})`, backgroundSize: "cover", backgroundPosition: "center", zIndex: 1 }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.8))", zIndex: 2 }} />
            
            <div className="section-content" style={{ position: "relative", zIndex: 3, maxWidth: "1000px", padding: "0 40px", textAlign: "left" }}>
              <div style={{ color: section.color, marginBottom: "20px" }}>{section.icon}</div>
              <h2 style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)", fontWeight: 800, marginBottom: "24px", lineHeight: 1.1 }}>{section.title}</h2>
              <p style={{ fontSize: "22px", color: "#d4d4d8", lineHeight: 1.6, maxWidth: "700px", marginBottom: "32px" }}>{section.description}</p>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <span style={{ fontSize: "14px", fontWeight: 700, color: section.color, textTransform: "uppercase", letterSpacing: "2px" }}>Featured Destinations</span>
                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                  {section.places.split(", ").map(p => (
                    <span key={p} style={{ padding: "10px 20px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", fontSize: "16px", fontWeight: 600 }}>{p}</span>
                  ))}
                </div>
              </div>
            </div>
          </section>
        ))}

        {/* Call to Action Section */}
        <section style={{ height: "80vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#000", position: "relative" }}>
          <div style={{ textAlign: "center", maxWidth: "800px", padding: "0 24px" }}>
            <h2 style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 800, marginBottom: "24px" }}>Ready for your next adventure?</h2>
            <p style={{ fontSize: "20px", color: "#a1a1aa", marginBottom: "40px" }}>Join Odysea today and start building the itinerary of a lifetime.</p>
            <Link href="/login" style={{ display: "inline-flex", alignItems: "center", gap: "10px", background: "#10b981", color: "#000", padding: "20px 40px", borderRadius: "100px", fontSize: "20px", fontWeight: 800, textDecoration: "none" }}>
              Get Started Now <ArrowRight size={24} />
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer style={{ borderTop: "1px solid rgba(255,255,255,0.05)", padding: "60px 24px", textAlign: "center", backgroundColor: "#000" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", color: "#10b981", fontWeight: 800, fontSize: "24px", marginBottom: "16px" }}>
            ODYSEA
          </div>
          <p style={{ color: "#52525b", fontSize: "16px", marginBottom: "32px" }}>© 2026 Odysea Inc. Discover the world with intelligence.</p>
          <div style={{ display: "flex", justifyContent: "center", gap: "24px", color: "#71717a", fontSize: "14px" }}>
            <a href="#" style={{ textDecoration: "none", color: "inherit" }}>Privacy</a>
            <a href="#" style={{ textDecoration: "none", color: "inherit" }}>Terms</a>
            <a href="#" style={{ textDecoration: "none", color: "inherit" }}>Instagram</a>
            <a href="#" style={{ textDecoration: "none", color: "inherit" }}>Twitter</a>
          </div>
        </footer>
      </main>

      <style>{`
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0) translateX(-50%); }
          40% { transform: translateY(-10px) translateX(-50%); }
          60% { transform: translateY(-5px) translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
