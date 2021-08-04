import React from "react";
import styles from "../../organisms/Skills/styles";

export function StackIcon({ name = "", icon = { src: "" }, link = "" }) {
  return (
    <a id="skill" className={styles.skillBlock} href={link} target="_blank">
      <img className={styles.skillIcon} src={icon.src} alt={name} />
      <h1 className={styles.skillTitle}>{name}</h1>
    </a>
  );
}
