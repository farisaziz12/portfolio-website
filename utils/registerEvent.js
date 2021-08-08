import ReactGA from "react-ga4";

export const registerEvent = (action) => {
  ReactGA.event({
    category: "User",
    action,
  });
};
