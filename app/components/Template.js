"use client";
import { useState, useEffect } from "react";
import styles from "./Template.module.css";

function Template({ type, updateTemplateData, initialData }) {
  const [currentLocation, setCurrentLocation] = useState(
    initialData.currentLocation
  );
  const [mother, setMother] = useState(initialData.mother);

  const handleCurrentLocationChange = (e) => {
    setCurrentLocation(e.target.value);
    updateTemplateData((prevData) => ({
      ...prevData,
      currentLocation: e.target.value,
    }));
  };

  const handleMotherChange = (e) => {
    setMother(e.target.value);
    updateTemplateData((prevData) => ({ ...prevData, mother: e.target.value }));
  };
  if (type === "character") {
    return (
      <div className={styles.templateContainer}>
        <h3>Character Details</h3>
        <input
          type="text"
          className={styles.inputField}
          placeholder="Current Location"
          value={initialData.currentLocation || currentLocation}
          onChange={handleCurrentLocationChange}
        />
        <input
          type="text"
          className={styles.inputField}
          placeholder="Mother"
          value={initialData.mother || mother}
          onChange={handleMotherChange}
        />
        {/* Add more fields as needed */}
      </div>
    );
  }

  // Add more templates for different types as needed

  return null;
}

export default Template;
