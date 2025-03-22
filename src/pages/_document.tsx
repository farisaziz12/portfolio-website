import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Character encoding */}
        <meta charSet="utf-8" />
        
        {/* Basic SEO */}
        <meta name="robots" content="index, follow" />
        
        {/* Default Open Graph tags that will be present on all pages */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Faris Aziz" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:image" content="https://faziz-dev.com/images/profile.jpg" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:creator" content="@FarisAziz12" />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
