import React, { useEffect } from "react";
import { resolveComponents, resolveIcon, resolveRichText } from "../../../utils";
import styles from "./styles";

export function Projects({ header, subheader, projects }) {
  useEffect(() => {
    ScrollReveal().reveal("#stack-icon", { delay: 250, scale: 0.5 });
  }, []);

  return (
    <div id="projects" className="grid justify-items-center mt-24">
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
    <div className="p-4 lg:pl-20 lg:pr-20 lg:w-full lg:h-min">
      {shouldShowDemo && (
        <div>
          {resolveComponents({ component: demoComponent }, { [demoComponent]: props })}
          <h1 className="text-center p-4 lg:block hidden">{name} Demo</h1>
        </div>
      )}
      <div className="bg-white rounded-lg shadow-2xl md:flex text-black">
        <img
          id="stack-icon"
          src={src}
          alt={name}
          className={
            "md:w-2/12 rounded-t-lg md:rounded-l-lg md:rounded-r-none w-full p-4" +
            (isDarkIcon
              ? " bg-white border-b-2 md:border-r-2 border-gray-300"
              : " bg-black")
          }
        />
        <div className="p-4 lg:p-6">
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
          <div className="mb-8 rich-text-block text-sm md:text-base lg:text-lg overflow-hidden break-words">
            {resolveRichText(description)}
          </div>
          {isPrivateRepo ? (
            <button className={styles.privateButton} disabled>
              Private Project
            </button>
          ) : (
            <div className="inline-flex flex-wrap justify-center">
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
