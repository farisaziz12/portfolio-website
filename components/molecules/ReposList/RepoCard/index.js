import React from "react";
import styles from "./styles";

export function RepoCard({ name, language, updatedAt, url, description }) {
  return (
    <a href={url} target="_blank" className={styles.card}>
      <div className="m-3">
        <div className={styles.nameAndLangContainer}>
          <h2 className={styles.name}>{name}</h2>
          <span className={styles.lang}>{language}</span>
        </div>
        <p className={styles.description}>{description || "No description"}</p>
      </div>
    </a>
  );
}
