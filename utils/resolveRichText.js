import { documentToReactComponents } from "@contentful/rich-text-react-renderer";

export const resolveRichText = (content) => {
  return documentToReactComponents(content);
};
