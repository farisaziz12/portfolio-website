import React from "react";
import { resolveComponents, resolveIcon, resolveRichText } from "../../../utils";
import styles from "./styles";

export function Projects({ header, subHeader, projects }) {
  return (
    <div id="projects" className="grid justify-items-center mt-24">
      <h1 className={styles.title}>{header || "Projects"}</h1>
      <h2 className={styles.subtitle}>
        {subHeader || "Cool Tech Projects I Have Developed"}
      </h2>
      {projects.map((project, index) => (
        <Project {...project} key={index} />
      ))}
    </div>
  );
}

function Project({
  name,
  description,
  repoUrl,
  livePreview,
  shouldShowDemo,
  stack = [],
  displayIcon,
  isPrivateRepo,
  demoComponent,
}) {
  const { src } = resolveIcon(displayIcon);
  const techSack = stack.join(" - ") || "";
  return (
    <div className="p-4 lg:p-20 lg:w-full lg:h-min">
      {shouldShowDemo && resolveComponents({ component: demoComponent })}
      <div className="bg-white rounded-lg shadow-2xl md:flex text-black">
        <img
          src={src}
          alt={name}
          className="md:w-2/12 rounded-t-lg md:rounded-l-lg md:rounded-t-none bg-black w-full p-4"
        />
        <div className="p-6">
          <h2 className="font-bold text-xl md:text-3xl mb-2">
            {name}{" "}
            <span className="font-light text-lg md:text-lg mb-2">
              - visibility:{" "}
              <span style={{ color: isPrivateRepo ? "red" : "green" }}>
                {isPrivateRepo ? "private" : "public"}
              </span>
            </span>
          </h2>
          {techSack && (
            <h3 className="font-bold text-base md:text-lg mb-2">
              Tech Stack: <span className="font-light">{techSack}</span>
            </h3>
          )}
          <div className="mb-8">{resolveRichText(description.content)}</div>
          {isPrivateRepo ? (
            <button className={styles.privateButton} disabled>
              Private Project
            </button>
          ) : (
            <div className="inline-flex flex-wrap justify-center gap-2">
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
