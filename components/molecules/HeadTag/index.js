import React, { useEffect } from "react";
import Head from "next/head";

export function HeadTag() {
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

  return (
    <Head>
      <title>Faris Aziz - Developer Portfolio</title>
      <meta
        name="description"
        content="Full Stack Software Engineer | Frontend | Backend | ReactJs | NodeJs | JavaScript"
      />
      <meta property="og:title" content="Faris Aziz - Developer Portfolio" />
      <meta
        property="og:description"
        content="Full Stack Software Engineer | Frontend | Backend | ReactJs | NodeJs | JavaScript"
      />
      <meta property="og:url" content="https://www.faziz-dev.com/" />
      <meta property="og:type" content="website" />
      <link rel="apple-touch-icon" sizes="57x57" href="/apple-icon-57x57.png" />
      <link rel="apple-touch-icon" sizes="60x60" href="/apple-icon-60x60.png" />
      <link rel="apple-touch-icon" sizes="72x72" href="/apple-icon-72x72.png" />
      <link rel="apple-touch-icon" sizes="76x76" href="/apple-icon-76x76.png" />
      <link rel="apple-touch-icon" sizes="114x114" href="/apple-icon-114x114.png" />
      <link rel="apple-touch-icon" sizes="120x120" href="/apple-icon-120x120.png" />
      <link rel="apple-touch-icon" sizes="144x144" href="/apple-icon-144x144.png" />
      <link rel="apple-touch-icon" sizes="152x152" href="/apple-icon-152x152.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-icon-180x180.png" />
      <link
        rel="icon"
        type="image/png"
        sizes="192x192"
        href="/android-icon-192x192.png"
      />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/manifest.json" />
      <meta name="msapplication-TileColor" content="#ffffff" />
      <meta name="msapplication-TileImage" content="/ms-icon-144x144.png" />
      <meta name="theme-color" content="#ffffff"></meta>
      <script src="https://unpkg.com/scrollreveal"></script>
    </Head>
  );
}
