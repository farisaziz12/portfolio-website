export const resolveNavItems = (sections) => {
  return sections.map(({ component }) => {
    return {
      name: component.replace(/\w/, (firstLetter) => firstLetter.toUpperCase()),
      link: component,
    };
  });
};
