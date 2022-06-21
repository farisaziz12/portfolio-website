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
        src: "https://press.discoveryplus.com/wp-content/uploads/2021/01/discovery-plus-logo-vertical-white-wordmark.jpg",
        isDarkIcon: false,
      };
    case "alexa":
      return {
        src: "https://smarthomeblog.de/wp-content/uploads/2018/10/Alexa-Logo-e1538735664768.png",
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
        src: "https://cdn.dribbble.com/users/1139587/screenshots/14688359/dec_02_raycast_logo_animation-2.png?compress=1&resize=300x400",
        isDarkIcon: false,
      };
    case "skiddle":
      return {
        src: "https://s3-eu-west-1.amazonaws.com/skiddlecdn-general/assets/logo/png/skiddle-logo-white-stacked.png",
        isDarkIcon: false,
      };
    case "fiit":
      return {
        src: "https://play-lh.googleusercontent.com/ySq9SahjHuJViHh6PRTRw5Ka0OS5W91qfuJvj2ZRj5sMxiFxSRdOcl5v9oXkJk_g0jw",
        isDarkIcon: true,
      }
    case "graphql":
      return {
        src: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/GraphQL_Logo.svg/1024px-GraphQL_Logo.svg.png",
        isDarkIcon: false,
      }
    case "docker":
      return {
        src: "https://www.docker.com/wp-content/uploads/2022/03/vertical-logo-monochromatic.png",
        isDarkIcon: false,
      }
    default:
      return generateIconProps(javaScriptIcon);
  }
};
