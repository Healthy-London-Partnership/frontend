import React from 'react';
import { inject, observer } from 'mobx-react';
import get from 'lodash/get';
import ReactMarkdown from 'react-markdown';
import ReactPlayer from 'react-player';

import CMSStore from '../stores/CMSStore';
import CMSPage from '../components/CMSPageLayout';
import MetaData from '../components/MetaData';

interface IProps {
  cmsStore: CMSStore;
}

const About: React.FunctionComponent<IProps> = ({ cmsStore }) => {
  if (!cmsStore) {
    return null;
  }

  const video = get(cmsStore, 'about.video_url');

  return (
    <CMSPage title={get(cmsStore, 'about.title')} breadcrumb="About">
      <MetaData
        title={get(cmsStore, 'about.title')}
        metaDescription={get(cmsStore, 'about.content')}
      />
      <ReactMarkdown source={get(cmsStore, 'about.content')} />
      {cmsStore.hasVideo && (
        <ReactPlayer
          url={video}
          style={{ borderRadius: '19px', margin: 'auto', marginTop: '24px' }}
          width={'90%'}
          light={true}
        />
      )}
    </CMSPage>
  );
};

export default inject('cmsStore')(observer(About));
