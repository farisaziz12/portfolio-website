export const getGithubContributions = async () => {
  try {
    const headers = {
      Authorization: `bearer ${process.env.GH_KEY}`,
    };
    const body = {
      query: `query {
            user(login: "farisaziz12") {
              name
              contributionsCollection {
                contributionCalendar {
                  colors
                  totalContributions
                  weeks {
                    contributionDays {
                      color
                      contributionCount
                      date
                      weekday
                    }
                    firstDay
                  }
                }
              }
            }
          }`,
    };
    const response = await fetch("https://api.github.com/graphql", {
      method: "POST",
      body: JSON.stringify(body),
      headers: headers,
    });
    const apiResponse = await response.json();

    const { totalContributions = 0 } =
      apiResponse.data.user.contributionsCollection.contributionCalendar;

    return totalContributions;
  } catch (error) {
    console.error(error);
  }
};

export const getGithubRepos = async () => {
  try {
    const response = await fetch("https://api.github.com/users/farisaziz12/repos", {
      headers: {
        Authorization: `Basic ${process.env.GH_API_BASIC_TOKEN}`,
      },
    });

    const data = await response.json();

    const formatedData = data.map(
      ({ name, updated_at, language, html_url, description = "" }) => ({
        name,
        updatedAt: updated_at,
        language,
        url: html_url,
        description,
      })
    );

    return formatedData
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .slice(0, 3);
  } catch (error) {
    console.error(error);
  }
};
