export const resolveRichText = (content, type) => {
  return content.map((contentNode) => {
    const { nodeType, content: nodeContent } = contentNode;

    if (nodeType === "unordered-list") {
      const list = nodeContent.map((listItem) => {
        return resolveRichText(listItem.content, listItem.nodeType)[0][0];
      });
      return <ul>{list}</ul>;
    } else if (nodeType === "hr") {
      return <div className="mt-4 mb-4"></div>;
    } else {
      const renderedText = nodeContent.map((textNode, index, arr) => {
        if (textNode.nodeType === "hyperlink") {
          const value = textNode.content[0].value;
          const href = textNode.data.uri;
          return (
            <a style={{ color: "blue" }} href={href} target="_blank">
              {value}
            </a>
          );
        } else {
          if (type === "list-item") {
            return (
              <li key={new Date().getTime() * Math.random()} className="p-1">
                - {textNode.value}
              </li>
            );
          } else {
            if (arr.map((node) => node.nodeType).includes("hyperlink")) {
              return (
                <span key={new Date().getTime() * Math.random()}>{textNode.value}</span>
              );
            } else {
              const isBold = textNode.marks[0]?.type === "bold";
              return (
                <h3
                  key={new Date().getTime() * Math.random()}
                  style={{ fontWeight: isBold ? "bold" : "normal" }}
                >
                  {textNode.value}
                </h3>
              );
            }
          }
        }
      });
      return renderedText;
    }
  });
};
