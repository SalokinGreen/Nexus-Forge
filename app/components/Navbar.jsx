import React from "react";
import Link from "next/link";
import styles from "./Navbar.module.css";

const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.left}>
        <Link href="/">
          <p className={styles.navLink}>Home</p>
        </Link>
      </div>
      <div className={styles.right}>
        <Link href="/dashboard">
          <p className={styles.navLink}>Dashboard</p>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
