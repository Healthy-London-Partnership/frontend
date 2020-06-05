import React from 'react';
import { inject, observer } from 'mobx-react';
import get from 'lodash/get';
import ReactMarkdown from 'react-markdown';

import CMSStore from '../stores/CMSStore';
import CMSPage from '../components/CMSPageLayout';
import Layout from '../components/Layout';

interface IProps {
  cmsStore: CMSStore;
}

const Privacy: React.FunctionComponent<IProps> = ({ cmsStore }) => {
  if (!cmsStore) {
    return null;
  }

  return (
    <Layout>
      <CMSPage title={get(cmsStore, 'privacy_policy.title')} breadcrumb="Privacy Policy">
        <ReactMarkdown source={get(cmsStore, 'privacy_policy.content')} />
      </CMSPage>
    </Layout>
  );
};

export default inject('cmsStore')(observer(Privacy));
