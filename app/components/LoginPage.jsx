"use client";
import React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../../Styles/Login.module.css";
import Navbar from "./Navbar";
import { useSupabase } from "../supabase-provider";
import { createClient } from "@supabase/supabase-js";
import SignUpForm from "./Dashboard/SignUp";
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [register, setRegister] = useState(false);
  const router = useRouter();
  const { supabase } = useSupabase();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    setLoading(false);

    if (data) {
      console.log("it works");
      console.log(data);
    } else {
      setError("error:", error.message);
    }
  }
  if (register) {
    return <SignUpForm setRegister={setRegister}/>;
  } else {
  return (
    <React.Fragment>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.form}>
          <h1 className={styles.title} onClick={() => setRegister(!register)}>Login</h1>
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
  );}
}
