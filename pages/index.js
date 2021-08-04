import Head from "next/head";
import { Navbar, Intro, Skills, LearnMore } from "../components";
import { getGithubContributions, getGithubRepos } from "../api";

export default function Home({ contributions, repos }) {
  return (
    <div className="h-full w-full text-white">
      <Head>
        <title>Faris Aziz Dev</title>
        <link rel="icon" href="/favicon.ico" />
        <script src="https://unpkg.com/scrollreveal"></script>
      </Head>
      <Navbar />
      <Intro />
      <LearnMore contributions={contributions} repos={repos} />
      <Skills />
    </div>
  );
}

export async function getStaticProps(context) {
  try {
    const contributions = await getGithubContributions();
    const repos = await getGithubRepos();

    return {
      props: { contributions, repos },
    };
  } catch (error) {
    return {
      props: { contributions: 0, repos: [] },
    };
  }
}
