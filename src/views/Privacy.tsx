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

const Privacy: React.FunctionComponent<IProps> = ({ cmsStore }) => {
  if (!cmsStore) {
    return null;
  }

  return (
    <CMSPage title={get(cmsStore, 'privacy_policy.title')} breadcrumb="Privacy Policy">
      <MetaData
        title="Privacy Policy"
      />
      <ReactMarkdown source={get(cmsStore, 'privacy_policy.content')} />
    </CMSPage>
  );
};

export default inject('cmsStore')(observer(Privacy));
