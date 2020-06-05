import React from 'react';
import { inject, observer } from 'mobx-react';
import get from 'lodash/get';
import ReactMarkdown from 'react-markdown';

import CMSPage from '../components/CMSPageLayout';
import CMSStore from '../stores/CMSStore';
import Layout from '../components/Layout';

interface IProps {
  cmsStore: CMSStore;
}

const Terms: React.FunctionComponent<IProps> = ({ cmsStore }) => {
  if (!cmsStore) {
    return null;
  }

  return (
    <Layout>
      <CMSPage title={get(cmsStore, 'terms_and_conditions.title')} breadcrumb="Terms & Conditions">
        <ReactMarkdown source={get(cmsStore, 'terms_and_conditions.content')} />
      </CMSPage>
    </Layout>
  );
};

export default inject('cmsStore')(observer(Terms));
