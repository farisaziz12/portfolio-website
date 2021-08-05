import {
  reactJsIcon,
  javaScriptIcon,
  nextJsIcon,
  nodeJsIcon,
  rubyIcon,
  bashIcon,
  typescriptIcon,
} from "../assets";

export const resolveIcon = (icon) => {
  if (!icon) return { src: "" };

  const normalizedIconName = icon.toLowerCase();
  switch (normalizedIconName) {
    case "reactjs" || "react.js" || "react":
      return reactJsIcon;
    case "nextjs" || "next.js":
      return nextJsIcon;
    case "javascript":
      return javaScriptIcon;
    case "typescript":
      return typescriptIcon;
    case "bash":
      return bashIcon;
    case "ruby":
      return rubyIcon;
    case "nodejs" || "node":
      return nodeJsIcon;
    default:
      return javaScriptIcon;
  }
};
