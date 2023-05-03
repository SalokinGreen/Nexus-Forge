import React from "react";
import styles from "./InfoBox.module.css";

const Infobox = ({ data }) => (
  <table className={styles.infobox}>
    <tbody>
      {data.map((item, index) => (
        <tr key={index}>
          <th className={styles.key}>{item.label}</th>
          <td className={styles.value}>{item.value}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default Infobox;
