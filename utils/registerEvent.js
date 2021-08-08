import ReactGA from "react-ga";

export const registerEvent = (action) => {
  ReactGA.event({
    category: "User",
    action,
  });
};
