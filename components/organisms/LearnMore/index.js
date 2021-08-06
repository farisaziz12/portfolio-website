import React from "react";
import { GHContributionsCounter, ReposList } from "../../molecules";

export function LearnMore({ contributions, repos }) {
  return (
    <div id="learn-more">
      {contributions && <GHContributionsCounter count={contributions} />}
      {repos[0] && <ReposList repos={repos} />}
    </div>
  );
}
