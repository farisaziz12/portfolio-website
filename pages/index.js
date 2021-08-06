import { Navbar, Intro, LearnMore, HeadTag } from "../components";
import { getGithubContributions, getGithubRepos, getContent } from "../api";
import { resolveComponents } from "../utils";

export default function Home({ contributions, repos = [], projects, sections = [] }) {
  return (
    <div className="h-full w-full text-white">
      <HeadTag />
      <Navbar />
      <Intro />
      <LearnMore contributions={contributions} repos={repos} />
      {sections[0] && sections.map((section) => resolveComponents(section, { projects }))}
    </div>
  );
}

export async function getServerSideProps(context) {
  try {
    const contributions = await getGithubContributions();
    const repos = await getGithubRepos();
    const { projects = [], sections = [] } = await getContent();

    return {
      props: { contributions, repos, projects, sections },
    };
  } catch (error) {
    return {
      props: { contributions: 0, repos: [], projects: [], sections: [] },
    };
  }
}
