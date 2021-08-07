import {
  reactJsIcon,
  javaScriptIcon,
  nextJsIcon,
  nodeJsIcon,
  rubyIcon,
  bashIcon,
  typescriptIcon,
  reactiveXIcon,
} from "../assets";

export const resolveIcon = (icon) => {
  if (!icon) return { src: "" };

  const generateIconProps = (icon, isDarkIcon = false) => {
    return { src: icon.src, isDarkIcon };
  };

  const normalizedIconName = icon.toLowerCase();
  switch (normalizedIconName) {
    case "reactjs":
    case "react.js":
    case "react":
      return generateIconProps(reactJsIcon);
    case "nextjs":
    case "next.js":
      return generateIconProps(nextJsIcon, true);
    case "javascript":
      return generateIconProps(javaScriptIcon);
    case "typescript":
      return generateIconProps(typescriptIcon);
    case "bash":
      return generateIconProps(bashIcon);
    case "ruby":
      return generateIconProps(rubyIcon);
    case "nodejs":
    case "node":
      return generateIconProps(nodeJsIcon);
    case "rxjs":
      return generateIconProps(reactiveXIcon);
    default:
      return generateIconProps(javaScriptIcon);
  }
};
