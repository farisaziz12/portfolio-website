import React from "react";
import CountUp from "react-countup";
import { githubIcon } from "../../../assets";
import styles from "../../organisms/Skills/styles";

export function GHContributionsCounter({ count }) {
  return (
    <div className={styles.contributionsContainer}>
      <h1 className={styles.contributionsHeader}>Github Contributions This Year:</h1>
      <div id="contributions" className={styles.contributionsCounterContainer}>
        <CountUp className={styles.contributionsCounter} duration={5} end={count} />
        <img className={styles.ghLogo} src={githubIcon.src} alt="GitHub logo" />
      </div>
    </div>
  );
}
