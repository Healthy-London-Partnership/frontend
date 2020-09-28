import React, { Component } from 'react';
import { isIOS } from 'react-device-detect';

import './InstructionModal.scss';
import HomeScreenIcon from '../../../assets/images/icons/home-screen-icon.png';

import Modal from 'react-modal';

class InstructionModal extends Component<any> {
  render() {
    const renderModalContent = ()=>{
      if(isIOS){
        return <p>You can add the launcher to your home screen by clicking the 'Share Options'  'Add to home Screen' then 'Add</p>;
      } else{
        return <p>You can add the launcher to your home screen by clicking the 'Settings'  'Add to shortcut to home'</p>;
      }
    }

    const renderModalFooter = ()=>{
      if(isIOS){
        return <p>Tap then 'Add to homescreen'</p>;
      } else{
        return <p>Tap then 'Add shortcut to home'</p>;
      }
    }

    return (
      <Modal
        isOpen={this.props.isOpen}
        className="modal instruction-modal"
        shouldCloseOnEsc={true}
        shouldCloseOnOverlayClick={true}
      >
        <div className="instruction-modal__main">
          <div className="instruction-modal__icon">
            <span>
              <img src={HomeScreenIcon} alt="Add to home screen icon" />
            </span>
          </div>

          <div className="instruction-modal__content">
            <p>
              <strong>Connected Together</strong><br />
              https://connect.nhs.uk/
            </p>
            <p>Add this app to your home screen for quick access to our services.</p>
            {renderModalContent()}
          </div>
        </div>
        <div className="instruction-modal__footer">
          {renderModalFooter()}
        </div>
      </Modal>
    );
  }
}

export default InstructionModal;