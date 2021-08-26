import { useEffect } from "react";
import { DarkModeProvider, DarkModeContext } from "../contexts";
import { initSessionTracker } from "../utils";
import "tailwindcss/tailwind.css";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    initSessionTracker();
    const logStyles = [
      "color: #fff",
      "background-color: #444",
      "padding: 2px 4px",
      "border-radius: 2px",
    ].join(";");

    const message =
      "Hello Fellow Developer!\nNice to see you prying around the dev console 😉\nFeel free to give me a follow on GitHub to check out how this portfolio was built or some of the other stuff I tinker with:\nhttps://github.com/farisaziz12";

    console.log(`%c${message}`, logStyles);
  }, []);

  return (
    <DarkModeProvider>
      <DarkModeContext.Consumer>
        {([isDarkMode]) => <Component {...pageProps} isDarkMode={isDarkMode} />}
      </DarkModeContext.Consumer>
    </DarkModeProvider>
  );
}

export default MyApp;
