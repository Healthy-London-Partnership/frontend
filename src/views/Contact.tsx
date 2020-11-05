import React from 'react';
import { inject, observer } from 'mobx-react';
import get from 'lodash/get';
import ReactMarkdown from 'react-markdown';

import CMSStore from '../stores/CMSStore';
import CMSPage from '../components/CMSPageLayout';
import MetaData from '../components/MetaData';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface IProps {
  cmsStore: CMSStore;
}

const Contact: React.FunctionComponent<IProps> = ({ cmsStore }) => {
  if (!cmsStore) {
    return null;
  }

  return (
    <CMSPage title={get(cmsStore, 'contact.title')} twoColumn={true} breadcrumb="Contact">
      <MetaData
        title={get(cmsStore, 'contact.title')}
      />
      <div className="flex-container flex-container--no-padding">
        <div className="flex-col flex-col--6">
          <ReactMarkdown source={get(cmsStore, 'contact.content')} />
        </div>
        {cmsStore.hasContactInfo && (
          <div className="cms__contact-card flex-col flex-col--6">
            <h3>Contact</h3>
            {get(cmsStore, 'global.contact_phone') !== 'Contact phone' && (
              <div className="cms--contact-card--row">
                <h4>
                  <FontAwesomeIcon icon="phone" /> Telephone
                </h4>
                <p>{get(cmsStore, 'global.contact_phone')}</p>
              </div>
            )}
            {get(cmsStore, 'global.contact_email') !== 'Contact email' && (
              <div className="cms--contact-card--row">
                <h4>
                  <FontAwesomeIcon icon="envelope" /> Email
                </h4>
                <a
                  className="cms--contact-card--email"
                  href={`mailto:${get(cmsStore, 'global.contact_email')}`}
                >
                  {get(cmsStore, 'global.contact_email')}
                </a>
              </div>
            )}

            <div className="flex-col flex-col--12 cms--contact-card--socials service__contact-card--row">
              {get(cmsStore, 'global.facebook_handle') !== 'Facebook handle' && (
                <a
                  href={`https://facebook.com/${get(cmsStore, 'global.facebook_handle')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Connected Together Facbook"
                >
                  <FontAwesomeIcon icon={['fab', 'facebook-f']} className="service__social-icon" />
                </a>
              )}
              {get(cmsStore, 'global.twitter_handle') !== 'Twitter handle' && (
                <a
                  href={`https://twitter.com/${get(cmsStore, 'global.twitter_handle')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Connected Together Twitter"
                >
                  <FontAwesomeIcon icon={['fab', 'twitter']} className="service__social-icon" />
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </CMSPage>
  );
};

export default inject('cmsStore')(observer(Contact));
