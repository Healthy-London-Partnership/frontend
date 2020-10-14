import React from 'react';
import { inject, observer } from 'mobx-react';
import get from 'lodash/get';
import ReactMarkdown from 'react-markdown';

import CMSStore from '../stores/CMSStore';
import CMSPage from '../components/CMSPageLayout';
import MetaData from '../components/MetaData';

interface IProps {
  cmsStore: CMSStore;
}

const Providers: React.FunctionComponent<IProps> = ({ cmsStore }) => {
  if (!cmsStore) {
    return null;
  }

  return (
    <CMSPage title={get(cmsStore, 'providers.title')} breadcrumb="Providers">
      <MetaData
        title="Providers"
        metaDescription={get(cmsStore, 'providers.title')}
      />
      <ReactMarkdown source={get(cmsStore, 'providers.content')} />
    </CMSPage>
  );
};

export default inject('cmsStore')(observer(Providers));
