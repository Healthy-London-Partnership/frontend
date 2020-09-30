import React from 'react';
import Helmet from 'react-helmet';

interface IProps {
  title?: string;
  metaDescription?: string;
  metaName?: string;
  metaImage?: string;
  ogUrl?: string;
  ogType?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
}

const MetaData: React.FunctionComponent<IProps> = ({
  title = 'Connected Together - Search for support and advice for health and wellbeing',
  metaDescription = 'Search for support and advice for health and wellbeing',
  metaName = 'Connected Together',
  metaImage,
  ogUrl,
  ogType,
  ogTitle = 'Connected Together',
  ogDescription = metaDescription,
  ogImage = metaImage,
  twitterTitle = 'Connected Together',
  twitterDescription = metaDescription,
  twitterImage = metaImage,
}) => (
  <Helmet>
    {/* <!-- HTML Meta Tags --> */}
    <title>{title}</title>
    <meta
      name="description"
      content={metaDescription}
    />

    {/* <!-- Google / Search Engine Tags --> */}
    <meta itemProp="name" content={metaName} />
    <meta
      itemProp="description"
      content={metaDescription}
    />
    <meta
      itemProp="image"
      content={metaImage}
    />

    {/* <!-- Facebook Meta Tags --> */}
    <meta property="og:url" content={ogUrl} />
    <meta property="og:type" content={ogType} />
    <meta property="og:title" content={ogTitle} />
    <meta
      property="og:description"
      content={ogDescription}
    />
    <meta
      property="og:image"
      content={ogImage}
    />

    {/* <!-- Twitter Meta Tags --> */}
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={twitterTitle} />
    <meta
      name="twitter:description"
      content={twitterDescription}
    />
    <meta
      name="twitter:image"
      content={twitterImage}
    />
  </Helmet>
);

export default MetaData;