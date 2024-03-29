import React, { useEffect, useState } from "react";
import ReactGA from "react-ga4";
import { Navbar, Intro, LearnMore, HeadTag, Footer } from "../components";
import { getGithubContributions, getGithubRepos, getContent } from "../api";
import { resolveComponents, setupDarkMode } from "../utils";

export default function Home({
  contributions,
  repos = [],
  projects,
  sections = [],
  toast,
  footerLinks = [],
  isDarkMode,
}) {
  const [mediumPosts, setMediumPosts] = useState([]);

  useEffect(() => {
    ReactGA.initialize(process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID);
    ReactGA.pageview(window.location.pathname + window.location.hash);
  }, []);

  useEffect(() => {
    setupDarkMode(isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    fetch("/api/medium-feed").then(resp => resp.json()).then(({items}) => {
      setMediumPosts(items)
    })
  }, [])

  const navSections = ["posts", ...new Set(sections.map((section) => section.component))];
  return (
    <div className={"h-full w-full text-white" + (isDarkMode ? " dark" : "")}>
      <HeadTag />
      <Navbar sections={navSections} toast={toast} />
      <Intro />
      <LearnMore contributions={contributions} repos={repos} mediumPosts={mediumPosts}  />
      {sections[0] && sections.map((section) => resolveComponents(section, { projects }))}
      <Footer footerLinks={footerLinks} />
    </div>
  );
}

export async function getServerSideProps(context) {
  try {
    const contributions = await getGithubContributions();
    const repos = await getGithubRepos();
    const {
      projects = [],
      sections = [],
      toast = [],
      footerLinks = [],
    } = await getContent();

    return {
      props: {
        contributions,
        repos,
        projects,
        sections,
        footerLinks,
        toast: toast[0] || {},
      },
    };
  } catch (error) {
    return {
      props: {
        contributions: 0,
        repos: [],
        projects: [],
        sections: [],
        toast: {},
        footerLinks: [],
      },
    };
  }
}
