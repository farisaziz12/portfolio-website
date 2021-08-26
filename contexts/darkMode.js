import { createContext, useEffect } from "react";
import { useToggle } from "../hooks";

export const DarkModeContext = createContext(false);

export const DarkModeProvider = ({ children }) => {
  const [isDarkMode, toggleDarkMode] = useToggle(false);

  useEffect(() => {
    const isUserSystemInDarkMode = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    if (isUserSystemInDarkMode) {
      toggleDarkMode();
    }
  }, []);

  return (
    <DarkModeContext.Provider value={[isDarkMode, toggleDarkMode]}>
      {children}
    </DarkModeContext.Provider>
  );
};
