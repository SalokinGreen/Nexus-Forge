import { useState } from "react";
import styles from "../../../Styles/SignUp.module.css";
import Navbar from "../Navbar";
import { useSupabase } from "@/app/supabase-provider";

export default function SignUpForm({ setRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [message, setMessage] = useState("");
  const { supabase } = useSupabase();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { data: inviteData, error: inviteError } = await supabase
      .from("invites")
      .select("*")
      .eq("code", inviteCode)
      .eq("is_used", false)
      .single();

    if (inviteError || !inviteData) {
      return setMessage(
        "Your code is either invalid or has already been used."
      );
    }

    // Create a new user
    const { user, session, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) {
      return setMessage("Something went wrong. Please try again.");
    }
    // Change the invite to mark it as used
    await supabase
      .from("invites")
      .update({ is_used: true })
      .eq("code", inviteCode);
    // Success
    setMessage(
      "Success! Confirm your email to login. Check your spam folder if you don't see it."
    );
    setEmail("");
    setPassword("");
    setInviteCode("");
  };

  return (
    <div className={styles.container}>
      <Navbar />
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2 className={styles.title} onClick={() => setRegister(false)}>
          Sign Up
        </h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className={styles.input}
        />
        <input
          type="text"
          placeholder="Invite Code"
          value={inviteCode}
          onChange={(e) => setInviteCode(e.target.value)}
          required
          className={styles.input}
        />
        <button type="submit" className={styles.button}>
          Register
        </button>
        {message && <p className={styles.error}>{message}</p>}
      </form>
    </div>
  );
}
