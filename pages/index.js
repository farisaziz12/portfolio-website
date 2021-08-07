import { Navbar, Intro, LearnMore, HeadTag, Footer } from "../components";
import { getGithubContributions, getGithubRepos, getContent } from "../api";
import { resolveComponents } from "../utils";

export default function Home({
  contributions,
  repos = [],
  projects,
  sections = [],
  toast,
}) {
  return (
    <div className="h-full w-full text-white">
      <HeadTag />
      <Navbar sections={sections} toast={toast} />
      <Intro />
      <LearnMore contributions={contributions} repos={repos} />
      {sections[0] && sections.map((section) => resolveComponents(section, { projects }))}
      <Footer />
    </div>
  );
}

export async function getServerSideProps(context) {
  try {
    const contributions = await getGithubContributions();
    const repos = await getGithubRepos();
    const { projects = [], sections = [], toast = [] } = await getContent();

    return {
      props: { contributions, repos, projects, sections, toast: toast[0] || {} },
    };
  } catch (error) {
    return {
      props: { contributions: 0, repos: [], projects: [], sections: [], toast: {} },
    };
  }
}
