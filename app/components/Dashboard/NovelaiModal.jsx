import React, { useState } from "react";
import styles from "../../../Styles/NovelaiModal.module.css";

const NovelaiModal = ({ isOpen, onClose, onSubmit }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await onSubmit(email, password);
    if (result.success) {
      setMessage("Access key retrieved successfully");
      setMessageType("success");
    } else {
      setMessage(
        "Error: Something went wrong. Check your credentials, or NovelAI's servers may be down."
      );
      setMessageType("error");
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose}>
          X
        </button>
        <h2 className={styles.modalTitle}>Retrieve NovelAI Access Key</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Submit</button>
        </form>
        {message && (
          <div
            className={
              messageType === "success"
                ? styles.successMessage
                : styles.errorMessage
            }
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default NovelaiModal;
