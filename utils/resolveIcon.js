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
      return generateIconProps(nodeJsIcon, true);
    case "rxjs":
      return generateIconProps(reactiveXIcon);
    case "discovery-plus":
      return {
        src: "https://cdn.freelogovectors.net/wp-content/uploads/2020/12/discovery-plus-logo.png",
        isDarkIcon: false,
      };
    case "alexa":
      return {
        src: "https://d3ogm7ac91k97u.cloudfront.net/en-US/alexa/branding/alexa-guidelines/brand-guidelines/the-alexa-logo.thumb.800.480.png",
        isDarkIcon: false,
      };
    case "eurosport":
      return {
        src: "https://layout.eurosport.com/i/v8/promo_mobile/news/wen/logo.png",
        isDarkIcon: true,
      };
    case "gcn":
      return {
        src: "https://is2-ssl.mzstatic.com/image/thumb/Purple115/v4/eb/5a/20/eb5a201a-ce5b-68b3-e9bd-7be1e6a8baa5/GCNAppIcon-0-0-1x_U007emarketing-0-0-0-5-0-0-sRGB-0-0-0-GLES2_U002c0-512MB-85-220-0-0.png/1024x1024bb.jpg",
        isDarkIcon: true,
      };
    case "raycast":
      return {
        src: "https://console.dev/img/interviews/raycast-petr-nikolaev-logo.png",
        isDarkIcon: false,
      };
    case "skiddle":
      return {
        src: "https://s3-eu-west-1.amazonaws.com/skiddlecdn-general/assets/logo/png/skiddle-logo-white-stacked.png",
        isDarkIcon: false,
      };
    default:
      return generateIconProps(javaScriptIcon);
  }
};
