"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface StoredUser {
  fullName: string;
  email: string;
  password: string;
}

export default function EditProfilePage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("currentUser");
    if (!stored) {
      router.push("/login");
      return;
    }
    const currentUser = JSON.parse(stored);
    setFullName(currentUser.fullName || "");
    setEmail(currentUser.email || "");
    setLoading(false);
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newFullName = fullName.trim();
    const newPassword = password;

    if (!newFullName) {
      alert("Full Name is required.");
      return;
    }

    if (newPassword && newPassword.length < 8) {
      alert("Password must be at least 8 characters long.");
      return;
    }

    // Get all users
    let storedUsers: StoredUser[] = JSON.parse(
      localStorage.getItem("users") || "[]"
    );

    // Find and update the user in the "database" (localStorage)
    let userUpdated = false;
    storedUsers = storedUsers.map((user) => {
      if (user.email === email) {
        user.fullName = newFullName;
        if (newPassword) {
          user.password = newPassword;
        }
        userUpdated = true;
      }
      return user;
    });

    if (userUpdated) {
      // Save updated users list
      localStorage.setItem("users", JSON.stringify(storedUsers));

      // Update current user session
      const currentUser = JSON.parse(
        localStorage.getItem("currentUser") || "{}"
      );
      currentUser.fullName = newFullName;
      localStorage.setItem("currentUser", JSON.stringify(currentUser));

      alert("Profile updated successfully!");
      router.push("/");
    } else {
      alert("Error updating profile. User not found in database.");
    }
  };

  if (loading) {
    return null;
  }

  return (
    <div className="auth-body">
      <div className="login-container">
        <form onSubmit={handleSubmit}>
          <h2>Edit Profile</h2>
          <p>Update your account details</p>

          <div className="input-group">
            <label htmlFor="fullname">Full Name</label>
            <input
              type="text"
              id="fullname"
              placeholder="Enter your full name"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              required
              readOnly
              title="Email cannot be changed"
              value={email}
              onChange={() => {}}
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">New Password (optional)</label>
            <input
              type="password"
              id="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="login-btn">
            Save Changes
          </button>

          <p className="signup-link">
            <Link href="/">Cancel and go back</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
