export const setupDarkMode = (isDarkMode) => {
  if (isDarkMode) {
    document.body.classList.remove("body-light");
    document.body.classList.add("body-dark");
  } else {
    document.body.classList.remove("body-dark");
    document.body.classList.add("body-light");
  }
};
