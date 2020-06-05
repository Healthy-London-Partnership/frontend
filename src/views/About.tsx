import React from 'react';
import { inject, observer } from 'mobx-react';
import get from 'lodash/get';
import ReactMarkdown from 'react-markdown';
import ReactPlayer from 'react-player';

import CMSStore from '../stores/CMSStore';
import CMSPage from '../components/CMSPageLayout';
import Layout from '../components/Layout';

interface IProps {
  cmsStore: CMSStore;
}

const About: React.FunctionComponent<IProps> = ({ cmsStore }) => {
  if (!cmsStore) {
    return null;
  }

  return (
    <Layout>
      <CMSPage title={get(cmsStore, 'about.title')} breadcrumb="About">
        <ReactMarkdown source={get(cmsStore, 'about.content')} />
        <ReactPlayer
          url={get(cmsStore, 'about.video_url')}
          style={{ borderRadius: '19px', margin: 'auto', marginTop: '24px' }}
          width={'90%'}
          light={true}
        />
      </CMSPage>
    </Layout>
  );
};

export default inject('cmsStore')(observer(About));
