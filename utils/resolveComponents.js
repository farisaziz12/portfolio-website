import { Skills, Projects, TVAppDemo } from "../components";

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
    case "tv-app" || "tv":
      return <TVAppDemo key={component} />;

    default:
      break;
  }
};
