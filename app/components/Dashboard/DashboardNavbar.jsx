import React, { useState, useEffect } from "react";
import styles from "../../../Styles/DashboardNavbar.module.css";
import { useRouter } from "next/navigation";
import { signOut } from "../../lib/auth";
import Settings from "./Settings";
import getNaiAccessToken from "@/utils/getNaiAccessToken";
import NovelaiModal from "./NovelaiModal";
const DashboardNavbar = () => {
  const router = useRouter();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const openModal = () => {
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
  };
  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };
  const handleDocumentClick = (e) => {
    if (!e.target.closest(`.${styles.optionsContainer}`)) {
      setDropdownVisible(false);
    }
  };
  useEffect(() => {
    document.addEventListener("click", handleDocumentClick);

    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, []);

  async function handleLogout() {
    await signOut();
    router.push("/login");
  }
  // function to move to /dashboard
  const handleDashboard = () => {
    router.push("/dashboard");
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };
  const getNovelaiAccessKey = async (email, password) => {
    const result = await getNaiAccessToken(email, password);
    if (result) {
      // put key(result) in local storage
      localStorage.setItem("nai_access_key", result);
      return { success: true };
    } else {
      return { success: false, error: result.error };
    }
  };

  return (
    <>
      <nav className={styles.navbar}>
        <div className={styles.logo} onClick={handleDashboard}>
          Dashboard
        </div>
        <div className={styles.optionsContainer}>
          <button className={styles.optionsButton} onClick={toggleDropdown}>
            Options
          </button>
          {dropdownVisible && (
            <div className={styles.dropdownMenu}>
              <div className={styles.menuItem}>
                <Settings
                  toggleModal={toggleModal}
                  modalVisible={modalVisible}
                />
              </div>
              <div className={styles.menuItem} onClick={openModal}>
                NovelAI
              </div>
              <div className={styles.menuItem}>Option 3</div>
            </div>
          )}
        </div>
        <button className={styles.logoutButton} onClick={handleLogout}>
          Logout
        </button>
        <NovelaiModal
          isOpen={modalOpen}
          onClose={closeModal}
          onSubmit={getNovelaiAccessKey}
        />
      </nav>
    </>
  );
};

export default DashboardNavbar;
