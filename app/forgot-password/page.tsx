"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");
    const existingUser = storedUsers.find(
      (user: { email: string }) => user.email.toLowerCase() === email.toLowerCase()
    );

    if (!existingUser) {
      setError("No account found with this email address.");
      return;
    }

    // In a real app this would send an email. For this demo we simulate it.
    setSubmitted(true);
  };

  return (
    <div className="auth-body">
      <div className="login-container">
        {submitted ? (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "3rem", marginBottom: "16px" }}>📧</div>
            <h2>Check Your Email</h2>
            <p style={{ marginBottom: "1.5rem" }}>
              If an account exists for <strong style={{ color: "#10b981" }}>{email}</strong>, you&apos;ll receive a password reset link shortly.
            </p>
            <Link href="/login" className="login-btn" style={{ display: "inline-block", textDecoration: "none", textAlign: "center" }}>
              Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <h2>Forgot Password</h2>
            <p>Enter your email and we&apos;ll send you a reset link.</p>

            {error && (
              <div className="form-toast form-toast-error">{error}</div>
            )}

            <div className="input-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                placeholder="email@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <button type="submit" className="login-btn">
              Send Reset Link
            </button>

            <p className="signup-link">
              Remember your password?{" "}
              <Link href="/login">Log in</Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
