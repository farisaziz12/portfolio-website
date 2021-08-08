import React, { useEffect } from "react";
import ReactGA from "react-ga";
import { Navbar, Intro, LearnMore, HeadTag, Footer } from "../components";
import { getGithubContributions, getGithubRepos, getContent } from "../api";
import { resolveComponents } from "../utils";

export default function Home({
  contributions,
  repos = [],
  projects,
  sections = [],
  toast,
  footerLinks = [],
}) {
  useEffect(() => {
    ReactGA.initialize(process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID);
    ReactGA.pageview(window.location.pathname + window.location.hash);
  }, []);

  return (
    <div className="h-full w-full text-white">
      <HeadTag />
      <Navbar sections={sections} toast={toast} />
      <Intro />
      <LearnMore contributions={contributions} repos={repos} />
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
