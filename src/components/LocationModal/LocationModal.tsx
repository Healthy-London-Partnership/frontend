import React, { Component } from 'react';
import Modal from 'react-modal';
import { inject, observer } from 'mobx-react';
import UIStore from '../../stores/uiStore';

import './LocationModal.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Input from '../Input';
import Button from '../Button';
import ResultsStore from '../../stores/resultsStore';
import { withRouter, RouteComponentProps } from 'react-router';
import Select from '../Select';

interface IProps extends RouteComponentProps {
  uiStore?: UIStore;
  resultsStore?: ResultsStore;
}

const radiusOptions = [
  { value: 5, text: '5 miles' },
  { value: 10, text: '10 miles' },
]

@inject('uiStore', 'resultsStore')
@observer
class LocationModal extends Component<IProps, any> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      postcode: '',
      radius: 5,
    };
  }

  handleInputChange = (string: string, field: string) => {
    // @ts-ignore
    this.setState({
      [field]: string,
    });
  };

  checkValidation(e: React.ChangeEvent<HTMLButtonElement>) {
    const { resultsStore } = this.props;

    e.preventDefault();
    if(this.state.postcode) {
      resultsStore!.postcodeChange(this.state.postcode);
      resultsStore!.setIsLiveActivity(true);
      this.props.history.push({
        pathname: '/results',
        search: resultsStore!.amendSearch()
      });
    } else {
      alert('Please fill in your location for us to find physical activities near you.');
    }
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
          <div className="flex-col flex-col--12 location-modal__close modal__close">
            <button onClick={() => uiStore.toggleLocationModal()} aria-label="Close modal">
              Close <FontAwesomeIcon icon="times" />
            </button>
          </div>
          <div className="flex-col flex-col--12 ">
            <h4 className="modal__title location-modal__title">Please enter your location to find physical activities near you:</h4>
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
            <div className="flex-col flex-col--12 modal__question location-modal__question">
              <label htmlFor="radius">Within a radius of:</label>
              <Select
                className="location-modal__select"
                options={radiusOptions}
                id="activity-radius"
                placeholder="Select a radius"
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => { }}
              />
            </div>
            <Button
              size="small"
              text="Find Physical Activities"
              onClick={(e: React.ChangeEvent<HTMLButtonElement>) => this.checkValidation(e)}
              type="submit"
            />
          </form>
        </div>
      </Modal>
    );
  }
}

Modal.setAppElement('#root');

export default withRouter(observer(LocationModal));
