import React from "react";
import { RepoCard } from "./RepoCard";
import styles from "./styles";

export function ReposList({ repos }) {
  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Recent Github Contributions:</h1>
      <div className={styles.reposContainer}>
        {repos.map((repo, index) => (
          <RepoCard key={index} {...repo} />
        ))}
      </div>
    </div>
  );
}
