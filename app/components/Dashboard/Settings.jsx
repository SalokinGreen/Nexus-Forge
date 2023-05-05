import React, { useState } from "react";
import styles from "../../../Styles/Settings.module.css";

const Settings = ({ toggleModal, modalVisible }) => {
  return (
    <div className={styles.container}>
      <p className={styles.a} onClick={toggleModal}>
        Settings
      </p>
      {modalVisible && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Settings</h2>
            <div className={styles.menuItem}>Setting 1</div>
            <div className={styles.menuItem}>Setting 2</div>
            <div className={styles.menuItem}>Setting 3</div>
            <button className={styles.closeButton} onClick={toggleModal}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
