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

const Funders: React.FunctionComponent<IProps> = ({ cmsStore }) => {
  if (!cmsStore) {
    return null;
  }

  return (
    <CMSPage title={get(cmsStore, 'funders.title')} breadcrumb="Funders">
      <MetaData
        title={get(cmsStore, 'funders.title')}
        metaDescription={get(cmsStore, 'funders.content')}
      />
      <ReactMarkdown source={get(cmsStore, 'funders.content')} />
    </CMSPage>
  );
};

export default inject('cmsStore')(observer(Funders));
