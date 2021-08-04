import React from "react";
import { RepoCard } from "./RepoCard";
import styles from "./styles";

export function ReposList({ repos }) {
  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Recent Github Contributions:</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 p-12">
        {repos.map((repo, index) => (
          <RepoCard key={index} {...repo} />
        ))}
      </div>
    </div>
  );
}
