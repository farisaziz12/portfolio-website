import { Skills, Projects, TVAppDemo, LaptopDemo } from "../components";

export const resolveComponents = (data, propMappings = {}) => {
  const { component } = data;

  const mapProps = () => {
    if (propMappings[component]) {
      return { [component]: propMappings[component], ...data };
    }
  };

  switch (component) {
    case "skills":
      return <Skills {...mapProps()} key={component} />;
    case "projects":
      return <Projects {...mapProps()} key={component} />;
    case "tv-app":
    case "tv":
      return <TVAppDemo key={component} />;
    case "mac":
    case "laptop":
    case "computer":
      return <LaptopDemo {...mapProps()} key={component} />;

    default:
      break;
  }
};
