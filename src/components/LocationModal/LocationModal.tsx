import React, { Component } from 'react';
import Modal from 'react-modal';
import { inject, observer } from 'mobx-react';
import UIStore from '../../stores/uiStore';

import './LocationModal.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Input from '../Input';
import Button from '../Button';

interface IProps {
  uiStore?: UIStore;
}

class LocationModal extends Component<IProps, any> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      postcode: '',
    };
  }

  handleInputChange = (string: string, field: string) => {
    // @ts-ignore
    this.setState({
      [field]: string,
    });
  };

  render() {
    const { uiStore } = this.props;

    if (!uiStore) {
      return null;
    }

    return (
      <Modal
        isOpen={uiStore.locationModalOpen}
        className=" location-modal"
        shouldCloseOnEsc={true}
        shouldCloseOnOverlayClick={true}
      >
        <div className="flex-container">
          <div className="flex-col flex-col--12 modal__close">
            <button onClick={() => uiStore.toggleLocationModal()} aria-label="Close modal">
              Close <FontAwesomeIcon icon="times" />
            </button>
          </div>
          <div className="flex-col flex-col--12 ">
            <h4 className="modal__title location-modal__title">To find the 'physical activities' that are most relevant to you we would like you to enter your location below:</h4>
          </div>
          <form className="modal__form location-modal__form flex-container flex-container--no-padding flex-container--right">
            <div className="flex-col flex-col--12 modal__question location-modal__question">
              <label htmlFor="search">Enter a location</label>
              <Input
                id="location"
                placeholder="e.g SW16 7GZ or Camden"
                value={this.state.postcode}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  this.handleInputChange(e.target.value, 'postcode')
                }
              />
            </div>
            <Button
              size="small"
              text="Find Physical Activities"
              onClick={(e: any) => {
                
              }}
              type="submit"
            />
          </form>
        </div>
      </Modal>
    );
  }
}

Modal.setAppElement('#root');

export default inject('uiStore')(observer(LocationModal));
