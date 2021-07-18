import * as React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { publicUrl } from './CommonMetaTags';

const defaultTitle = 'Tranquil | Environmental sounds to fill the void 🌧️ 🍃';
const defaultDescription =
  'Tranquil is a simple web-app that provides your own mix of environmental sounds, a perfect company to your focus sessions.';
const defaultOgImage = 'https://tranquil.vercel.app/apple-icon.png';

interface Props {
  image?: string;
  title?: string;
  description?: string;
  publishDate?: string;
  readingTime?: string;
}

export const PageMetaTags: React.FC<Props> = ({
  image = defaultOgImage,
  title = defaultTitle,
  description = defaultDescription,
  publishDate = '',
  readingTime = '',
}) => {
  const router = useRouter();
  const url = `${publicUrl}${router.pathname}`;

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      {/* Facebook OG meta tags */}
      <meta property="og:url" content={url} />
      <meta property="og:type" content="article" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter Meta Tags  */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:site" content={url} />
      <meta property="twitter:creator" content="@jackyef__" />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />
      <meta property="twitter:url" content={url} />

      {publishDate ? (
        <>
          <meta name="twitter:label1" content="Published on" />
          <meta name="twitter:data1" content={publishDate} />
        </>
      ) : null}

      {readingTime ? (
        <>
          <meta name="twitter:label2" content="Reading Time" />
          <meta name="twitter:data2" content={readingTime} />
        </>
      ) : null}
    </Head>
  );
};
