import { Skills, Projects, TVAppDemo, LaptopDemo, Services } from "../components";

export const resolveComponents = (data, propMappings = {}) => {
  const { component } = data;

  const mapProps = () => {
    if (propMappings[component]) {
      return { [component]: propMappings[component], ...data };
    } else {
      return data;
    }
  };

  switch (component) {
    case "skills":
      return <Skills {...mapProps()} key={component} />;
    case "projects":
      return <Projects {...mapProps()} key={component} />;
    case "services":
      return <Services {...mapProps()} key={component} />;
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
