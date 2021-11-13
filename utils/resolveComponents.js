import { Skills, Projects, TVAppDemo, LaptopDemo, Services } from "../components";

export const resolveComponents = (data, propMappings = {}) => {
  const { component, id } = data;

  const mapProps = () => {
    const componentProps = propMappings[component];
    if (componentProps) {
      if (Array.isArray(componentProps)) {
        const componentPropsArr = componentProps
          .map((prop) => {
            if (prop?.belongsTo?.sys?.id === id) {
              return prop;
            }
          })
          .filter(Boolean);

        return { [component]: componentPropsArr, ...data };
      }

      return { [component]: propMappings[component], ...data };
    } else {
      return data;
    }
  };

  const key = component + id;
  switch (component) {
    case "skills":
      return <Skills {...mapProps()} key={key} />;
    case "projects":
      return <Projects {...mapProps()} key={key} />;
    case "services":
      return <Services {...mapProps()} key={key} />;
    case "tv-app":
    case "tv":
      return <TVAppDemo key={key} />;
    case "mac":
    case "laptop":
    case "computer":
      return <LaptopDemo {...mapProps()} key={key} />;

    default:
      break;
  }
};
