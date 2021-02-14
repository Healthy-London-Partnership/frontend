import React, { Component } from 'react';

import { observer, inject } from 'mobx-react';
import { withRouter, RouteComponentProps } from 'react-router-dom';

import './PublicBetaBanner.scss';

import UIStore from '../../stores/uiStore';

interface IProps extends RouteComponentProps {
  uiStore?: UIStore;
}

@inject('uiStore')
@observer
class PublicBetaBanner extends Component<IProps, any> {
  render() {
    const { uiStore } = this.props;

    // injected stores must be typed as optional, but will always be there if injected. Allows workound for destructuring values from store
    if (!uiStore) {
      return null;
    }

    const { toggleFeedbackModal } = uiStore;

    return (
      <section className="public-beta-banner">
        <div className="flex-container flex-container--no-wrap flex-container--align-center flex-container--justify">
          <div className="flex-col">
            <span className="public-beta-banner-tag">BETA</span>
          </div>
          <div className="flex-col">
            <p className="public-beta-banner-information">
              {`This is a new service – your `}
              <button onClick={() => toggleFeedbackModal()}>feedback</button>
              {` will help us to improve it.`}
            </p>
          </div>
        </div>
      </section>
    );
  }
}

export default withRouter(PublicBetaBanner);
