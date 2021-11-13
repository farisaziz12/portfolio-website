const fazizTrainingSrc = "/video/faziz-training-mac.mp4";
const tvAppSrc = "/video/tv-app.mp4";
const gcnDemoSrc = "/video/gcn-demo.mp4";
const eurosportDemoSrc = "/video/eurosport-demo.mp4";

export const resolveVideoSource = (name = "") => {
  const normalizedName = name.toLowerCase();
  switch (normalizedName) {
    case "faziz-training":
    case "faziztraining":
      return fazizTrainingSrc;
    case "tv-app":
      return tvAppSrc;
    case "gcn connected tv app":
      return gcnDemoSrc;
    case "eurosport connected tv app":
      return eurosportDemoSrc;
    default:
      return "";
  }
};
