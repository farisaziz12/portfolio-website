import React, { useEffect } from "react";
import { resolveComponents, resolveIcon, resolveRichText } from "../../../utils";
import styles from "./styles";

export function Projects({ header, subheader, projects }) {
  useEffect(() => {
    ScrollReveal().reveal("#stack-icon", { delay: 250, scale: 0.5 });
  }, []);

  return (
    <div id="projects" className={styles.projectsContainer}>
      <h1 className={styles.title}>{header || "Projects"}</h1>
      <h2 className={styles.subtitle}>
        {subheader || "Cool Tech Projects I Have Developed"}
      </h2>
      {projects.map((project, index) => (
        <Project {...project} key={index} />
      ))}
    </div>
  );
}

function Project(props) {
  const {
    name,
    description,
    repoUrl,
    livePreview,
    shouldShowDemo,
    stack = [],
    displayIcon,
    isPrivateRepo,
    demoComponent,
  } = props;

  const { src, isDarkIcon } = resolveIcon(displayIcon);
  const techSack = stack.join(" - ") || "";
  return (
    <div className={styles.demoContainer}>
      {shouldShowDemo && (
        <div>
          {resolveComponents({ component: demoComponent }, { [demoComponent]: props })}
          <h1 className={styles.demoHeader}>{name} Demo</h1>
        </div>
      )}
      <div className={styles.projectContainer}>
        <img
          id="stack-icon"
          src={src}
          alt={name}
          className={
            styles.stackIcon +
            (isDarkIcon
              ? " bg-white border-b-2 md:border-r-2 border-gray-300"
              : " bg-black")
          }
        />
        <div className="p-4 lg:p-6">
          <h2 className={styles.name}>
            {name}{" "}
            <span className={styles.visibility}>
              - visibility:{" "}
              <span style={{ color: isPrivateRepo ? "red" : "green" }}>
                {isPrivateRepo ? "private" : "public"}
              </span>
            </span>
          </h2>
          {techSack && (
            <h3 className={styles.techStack}>
              Tech Stack: <span className="font-light">{techSack}</span>
            </h3>
          )}
          <div className={styles.description}>{resolveRichText(description)}</div>
          {isPrivateRepo ? (
            <button className={styles.privateButton} disabled>
              Private Project
            </button>
          ) : (
            <div className={styles.buttonsContainer}>
              {repoUrl && (
                <a href={repoUrl} target="_blank" className={styles.button}>
                  Source Code
                </a>
              )}
              {livePreview && (
                <a href={livePreview} target="_blank" className={styles.button}>
                  Live Preview
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
