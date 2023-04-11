import React from "react";
import { GHContributionsCounter, ReposList, PostsGrid } from "../../molecules";

export function LearnMore({ contributions, repos, mediumPosts }) {
  return (
    <div id="learn-more">
      {contributions && <GHContributionsCounter count={contributions} />}
      {repos[0] && <ReposList repos={repos} />}
      {mediumPosts[0] && <PostsGrid posts={mediumPosts} />}
    </div>
  );
}
