/* eslint-disable no-var */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { useEffect } from "react";
import "tailwindcss/tailwind.css";
import "../styles/globals.css";
import { GoogleAnalytics } from '@next/third-parties/google'

function MyApp({ Component, pageProps }) {

    useEffect(() => {
    // Inspectlet Asynchronous Code
    (function () {
      window.__insp = window.__insp || [];
      __insp.push(["wid", 1782959115]);
      var ldinsp = function () {
        if (typeof window.__inspld != "undefined") return;
        window.__inspld = 1;
        var insp = document.createElement("script");
        insp.type = "text/javascript";
        insp.async = true;
        insp.id = "inspsync";
        insp.src =
          ("https:" == document.location.protocol ? "https" : "http") +
          "://cdn.inspectlet.com/inspectlet.js?wid=1782959115&r=" +
          Math.floor(new Date().getTime() / 3600000);
        var x = document.getElementsByTagName("script")[0];
        x.parentNode.insertBefore(insp, x);
      };
      setTimeout(ldinsp, 0);
    })();
  }, []);

  useEffect(() => {
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
    <>
    <GoogleAnalytics gaId="G-45LW00BB6W" />
    <Component {...pageProps} />
    </>
  );
}

export default MyApp;
