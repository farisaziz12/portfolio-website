import React, { useEffect } from "react";
import { skills } from "./skills";
import { StackIcon } from "../../molecules";
import styles from "./styles";

export function Skills({ header, subHeader }) {
  useEffect(() => {
    ScrollReveal().reveal("#skills", { delay: 250 });
    ScrollReveal().reveal("#skill", { delay: 750, scale: 0.85 });
    ScrollReveal().reveal("#contributions", { delay: 250, scale: 0.5, reset: true });
  }, []);

  return (
    <div id="skills" className="grid justify-items-center">
      <h1 className={styles.title}>{header || "Skills / Tech Stack"}</h1>
      <h2 className={styles.subtitle}>{subHeader || "Stuff i'm really good at ;)"}</h2>
      <div className={styles.skillsGrid}>
        {skills.map((skill, index) => (
          <StackIcon {...skill} key={index} />
        ))}
      </div>
    </div>
  );
}
