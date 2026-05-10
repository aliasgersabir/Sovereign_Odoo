"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const validateEmail = (emailVal: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(emailVal);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    if (!password) {
      alert("Please enter your password.");
      return;
    }

    const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");
    const existingUser = storedUsers.find(
      (user: { email: string }) => user.email === email
    );

    if (!existingUser) {
      alert("No account found with this email. Please sign up first.");
      return;
    }

    if (existingUser.password !== password) {
      alert("Incorrect password. Please try again.");
      return;
    }

    localStorage.setItem(
      "currentUser",
      JSON.stringify({
        fullName: existingUser.fullName,
        email: existingUser.email,
      })
    );

    router.push("/");
  };

  return (
    <div className="auth-body">
      <div className="login-container">
        <form onSubmit={handleSubmit}>
          <h2>Welcome Back</h2>
          <p>Please enter your details</p>

          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="options">
            <label>
              <input type="checkbox" /> Remember me
            </label>
            <a href="#">Forgot password?</a>
          </div>

          <button type="submit" className="login-btn">
            Sign In
          </button>

          <p className="signup-link">
            Don&apos;t have an account?{" "}
            <Link href="/signup">Sign up</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
