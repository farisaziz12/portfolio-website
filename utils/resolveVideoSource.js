const fazizTrainingSrc = "/video/faziz-training-mac.mp4";

export const resolveVideoSource = (name = "") => {
  const normalizedName = name.toLowerCase();
  switch (normalizedName) {
    case "faziz-training":
    case "faziztraining":
      return fazizTrainingSrc;

    default:
      return "";
  }
};
