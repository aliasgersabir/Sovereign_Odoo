"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerUser } from "@/actions/auth";

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // 1. Check if passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    // 2. Check password length
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    const res = await registerUser({ email, password, fullName });
    if (res.error) {
      setError(res.error);
    } else {
      setSuccess("Account created successfully! Redirecting...");
      router.push("/");
    }
  };

  return (
    <div className="auth-body">
      <div className="login-container">
        <form onSubmit={handleSubmit}>
          <h2>Create Account</h2>
          <p>Join us today! It only takes a minute.</p>

          {error && (
            <div className="form-toast form-toast-error">{error}</div>
          )}
          {success && (
            <div className="form-toast form-toast-success">{success}</div>
          )}

          <div className="input-group">
            <label htmlFor="fullname">Full Name</label>
            <input
              type="text"
              id="fullname"
              placeholder="John Doe"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="email@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <span className="validation-hint">Please enter a valid email address</span>
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="At least 8 characters"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span className="validation-hint">Password must be at least 8 characters</span>
          </div>

          <div className="input-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              placeholder="Repeat password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="login-btn">
            Create Account
          </button>

          <p className="signup-link">
            Already have an account?{" "}
            <Link href="/login">Log in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
