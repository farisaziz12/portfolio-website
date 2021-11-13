export const resolveNavItems = (sections) => {
  return sections.map((section) => {
    return {
      name: section.replace(/\w/, (firstLetter) => firstLetter.toUpperCase()),
      link: section,
    };
  });
};
