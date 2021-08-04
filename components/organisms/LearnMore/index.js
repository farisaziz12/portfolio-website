import React from "react";
import { GHContributionsCounter, ReposList } from "../../molecules";

export function LearnMore({ contributions, repos }) {
  return (
    <div id="learn-more">
      <GHContributionsCounter count={contributions} />
      <ReposList repos={repos} />
    </div>
  );
}
