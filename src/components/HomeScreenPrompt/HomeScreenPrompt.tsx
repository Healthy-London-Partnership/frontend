import React, { Component } from 'react';
import Button from '../Button';

import HomeScreenIcon from '../../assets/images/icons/home-screen-icon.png';
import './HomeScreenPrompt.scss';

class HomeScreenPrompt extends Component<any> {
  setHomeScreenPromptCookie() {

  }

  render() {
    return (
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
    )
  }
}

export default HomeScreenPrompt;