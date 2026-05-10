import Link from "next/link";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <div className="logo">TRAVELO</div>
          <p>
            Premium travel experiences designed for the modern adventurer.
            Discover, plan, and explore the world with confidence.
          </p>
        </div>

        <div className="footer-column">
          <h4>Explore</h4>
          <Link href="/discover">Destinations</Link>
          <Link href="/itinerary">Trip Planner</Link>
          <Link href="/budget">Budget Tool</Link>
        </div>

        <div className="footer-column">
          <h4>Company</h4>
          <Link href="/discover">About Us</Link>
          <Link href="/discover">Careers</Link>
          <Link href="/discover">Press</Link>
        </div>

        <div className="footer-column">
          <h4>Support</h4>
          <Link href="/discover">Help Center</Link>
          <Link href="/discover">Contact</Link>
          <Link href="/discover">Privacy Policy</Link>
        </div>
      </div>

      <div className="footer-bottom">
        <span>&copy; {new Date().getFullYear()} Travelo. All rights reserved.</span>
        <div className="footer-socials">
          <Link href="/discover" aria-label="Twitter">𝕏</Link>
          <Link href="/discover" aria-label="Instagram">📷</Link>
          <Link href="/discover" aria-label="LinkedIn">in</Link>
        </div>
      </div>
    </footer>
  );
}
