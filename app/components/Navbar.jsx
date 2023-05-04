import React from "react";
import Link from "next/link";
import styles from "../../Styles/Navbar.module.css";
import { useRouter } from "next/navigation";
const Navbar = () => {
  const router = useRouter();
  // handle click on links
  const handleClick = (address) => {
    router.push(address);
  };
  return (
    <nav className={styles.navbar}>
      <div className={styles.left}>
        <p className={styles.navLink} onClick={() => handleClick("/")}>
          Home
        </p>
      </div>
      <div className={styles.right}>
        <p className={styles.navLink} onClick={() => handleClick("/dashboard")}>
          Dashboard
        </p>
      </div>
    </nav>
  );
};

export default Navbar;
