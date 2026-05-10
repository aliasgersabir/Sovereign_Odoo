"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginUser } from "@/actions/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const validateEmail = (emailVal: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(emailVal);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const res = await loginUser({ email, password });
    if (res.error) {
      setError(res.error);
    } else {
      router.push("/");
    }
  };

  return (
    <div className="auth-body">
      <div className="login-container">
        <form onSubmit={handleSubmit}>
          <h2>Welcome Back</h2>
          <p>Please enter your details</p>

          {error && (
            <div className="form-toast form-toast-error">{error}</div>
          )}

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
            <Link href="/forgot-password">Forgot password?</Link>
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
