"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Check if passwords match
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // 2. Check password length
    if (password.length < 8) {
      alert("Password must be at least 8 characters long.");
      return;
    }

    // 3. Create new user
    const newUser = {
      fullName: fullName,
      email: email,
      password: password, // In a real app, this would be encrypted by the server
    };

    console.log("User Registered:", newUser);
    alert("Account created successfully for " + fullName);

    const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");
    storedUsers.push(newUser);
    localStorage.setItem("users", JSON.stringify(storedUsers));

    router.push("/login");
  };

  return (
    <div className="auth-body">
      <div className="login-container">
        <form onSubmit={handleSubmit}>
          <h2>Create Account</h2>
          <p>Join us today! It only takes a minute.</p>

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
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="At least 8 characters"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
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
