import Head from 'next/head';
import Script from 'next/script';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  article?: boolean;
  keywords?: string;
  pathname?: string;
  structuredData?: Record<string, unknown>;
}

const SEO = ({ 
  title = 'Faris Aziz | Frontend Engineer & Conference Speaker',
  description = 'Engineering Manager & Frontend SME | Conference Speaker | Frontend Expert in NextJS, TS/JS & NodeJS | Pioneering a Tech Culture of Innovation',
  image = '/images/profile.jpg',
  article = false,
  keywords = 'frontend, engineering, nextjs, react, typescript, javascript, conference speaker, web development',
  pathname = '',
  structuredData
}: SEOProps) => {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://faziz-dev.com';
  const canonicalUrl = `${siteUrl}${pathname}`;
  const imageUrl = image.startsWith('http') ? image : `${siteUrl}${image}`;

  // Format JSON-LD structured data
  const jsonLd = structuredData
    ? JSON.stringify(structuredData)
    : JSON.stringify({
        '@context': 'https://schema.org',
        '@type': article ? 'Article' : 'WebPage',
        headline: title,
        image: imageUrl,
        author: {
          '@type': 'Person',
          name: 'Faris Aziz',
        },
        description: description,
        url: canonicalUrl,
      });

  return (
    <>
      <Head>
        {/* Basic Meta Tags */}
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <link rel="canonical" href={canonicalUrl} />

        {/* Open Graph */}
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content={article ? 'article' : 'website'} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={imageUrl} />
        <meta property="og:site_name" content="Faris Aziz" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:creator" content="@FarisAziz12" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={imageUrl} />

        {/* Additional SEO Tags */}
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Faris Aziz" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      
      {/* JSON-LD structured data */}
      <Script 
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd }}
        strategy="beforeInteractive"
      />
    </>
  );
};

export default SEO; 