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

const GetInvolved: React.FunctionComponent<IProps> = ({ cmsStore }) => {
  if (!cmsStore) {
    return null;
  }

  return (
    <Layout>
      <CMSPage title={get(cmsStore, 'get_involved.title')} breadcrumb="Get Involved">
        <ReactMarkdown source={get(cmsStore, 'get_involved.content')} />
      </CMSPage>
    </Layout>
  );
};

export default inject('cmsStore')(observer(GetInvolved));
