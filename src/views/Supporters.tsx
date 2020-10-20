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

const Supporters: React.FunctionComponent<IProps> = ({ cmsStore }) => {
  if (!cmsStore) {
    return null;
  }

  return (
    <CMSPage title={get(cmsStore, 'supporters.title')} breadcrumb="Supporters">
      <MetaData
        title={get(cmsStore, 'supporters.title')}
        metaDescription={get(cmsStore, 'supporters.content')}
      />
      <ReactMarkdown source={get(cmsStore, 'supporters.content')} />
    </CMSPage>
  );
};

export default inject('cmsStore')(observer(Supporters));
