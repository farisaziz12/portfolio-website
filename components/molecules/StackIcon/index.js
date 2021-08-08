import React from "react";
import { registerEvent } from "../../../utils";
import styles from "../../organisms/Skills/styles";

export function StackIcon({ name = "", icon = { src: "" }, link = "" }) {
  return (
    <a
      id="skill"
      onClick={() => registerEvent(`${name} Stack Icon Clicked`)}
      className={styles.skillBlock}
      href={link}
      target="_blank"
    >
      <img loading="lazy" className={styles.skillIcon} src={icon.src} alt={name} />
      <h1 className={styles.skillTitle}>{name}</h1>
    </a>
  );
}
