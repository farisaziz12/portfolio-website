import React from "react";
import { githubIcon } from "../../../../assets";
import { registerEvent } from "../../../../utils";
import styles from "./styles";

export function RepoCard({ name, language, updatedAt, url, description }) {
  return (
    <a
      href={url}
      target="_blank"
      className={styles.card}
      onClick={() => registerEvent(`${name} Repo Clicked`)}
    >
      <div className="m-3">
        <div className={styles.nameAndLangContainer}>
          <h2 className={styles.name}>{name}</h2>
          <img className={styles.ghLogo} src={githubIcon.src} alt="GitHub logo" />
          <span className={styles.lang}>{language}</span>
        </div>
        <p className={styles.description}>{description || "No description"}</p>
      </div>
    </a>
  );
}
