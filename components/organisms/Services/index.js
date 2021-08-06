import React from "react";
import styles from "./styles";

export function Services({ header, subheader }) {
  return (
    <div id="services" className="grid justify-items-center mt-24">
      <h1 className={styles.title}>{header || "Services"}</h1>
      <h2 className={styles.subtitle}>{subheader || "Here's what I can offer"}</h2>
    </div>
  );
}
