import React, { Component, Fragment } from 'react';

import Button from '../Button';
import HomeScreenIcon from '../../assets/images/icons/home-screen-icon.png';
import './HomeScreenPrompt.scss';

import { observer, inject } from 'mobx-react';

@inject('windowSizeStore')
@observer
class HomeScreenPrompt extends Component<any> {
  setHomeScreenPromptCookie() {

  }

  render() {
    const { windowSizeStore } = this.props;

    // injected stores must be typed as optional, but will always be there if injected. Allows workound for destructuring values from store
    if (!windowSizeStore) {
      return null;
    }

    const { isMobile } = windowSizeStore;
    
    return (
      <Fragment>
        {isMobile &&
          <div className="home-screen-prompt">
            <div className="home-screen-prompt__wrapper">
              <div className="home-screen-prompt__icon">
                <span>
                  <img src={HomeScreenIcon} alt="Add to home screen icon" />
                </span>
              </div>
              <div className="home-screen-prompt__info">
                <h3 className="home-screen-prompt__title">Add to homescreen?</h3>
                <p className="home-screen-prompt__description">Add this website to your homescreen to quickly access support opportunities</p>
                <div className="home-screen-prompt__ctas">
                  <Button
                    size="small"
                    light={true}
                    text="No thanks"
                    type="button"
                    onClick={(e: React.ChangeEvent<HTMLButtonElement>) => this.setHomeScreenPromptCookie()}
                  />
                  <Button
                    size="small"
                    text="Yes, let's add"
                    type="button"
                    onClick={(e: React.ChangeEvent<HTMLButtonElement>) => this.setHomeScreenPromptCookie()}
                  />
                </div>
              </div>
            </div>
          </div>
        }
      </Fragment>
    )
  }
}

export default HomeScreenPrompt;