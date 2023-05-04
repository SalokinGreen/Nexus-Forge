"use client";
import React from "react";
import { useState } from "react";
import { signInWithEmail } from "../lib/auth";
import { useRouter } from "next/navigation";
import styles from "./Login.module.css";
import Navbar from "../components/Navbar";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { data: user, error } = await signInWithEmail(email, password);
    setLoading(false);

    if (user) {
      router.push("/dashboard");
    } else {
      setError(error.message);
    }
  }

  return (
    <React.Fragment>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.form}>
          <h1 className={styles.title}>Login</h1>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              className={styles.input}
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              className={styles.input}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit" className={styles.button} disabled={loading}>
              Login
            </button>
          </form>
          {error && <p className={styles.error}>{error}</p>}
        </div>
      </div>
    </React.Fragment>
  );
}
