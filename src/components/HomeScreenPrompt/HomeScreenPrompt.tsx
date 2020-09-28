import React, { Component, Fragment } from 'react';
import { isMobile } from 'react-device-detect';

import Button from '../Button';
import InstructionModal from './InstructionModal/InstructionModal';
import HomeScreenIcon from '../../assets/images/icons/home-screen-icon.png';
import './HomeScreenPrompt.scss';

import { observer } from 'mobx-react';

interface IState {
  showInstructionModal: boolean;
}

@observer
class HomeScreenPrompt extends Component<any, IState> {
  constructor(props: any) {
    super(props);

    this.state = {
      showInstructionModal: false
    }
  }

  triggerInstructionModal() {
    this.setState({
      showInstructionModal : true
    });

    this.setHomeScreenPromptCookie();
  }

  setHomeScreenPromptCookie() {

  }

  render() {
    const { showInstructionModal } = this.state;
    
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
                    onClick={(e: React.ChangeEvent<HTMLButtonElement>) => this.triggerInstructionModal()}
                  />
                </div>
              </div>
            </div>
            <InstructionModal isOpen={showInstructionModal}/>
          </div>
        }
      </Fragment>
    )
  }
}

export default HomeScreenPrompt;