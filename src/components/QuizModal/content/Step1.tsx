import React, { Fragment, FunctionComponent } from 'react';
import '../QuizModal.scss';
import quizStore from '../../../stores/quizStore';
import { observer } from 'mobx-react';

import Input from '../../Input';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface IProps {
  stepTitle?: string;
}

const Step1: FunctionComponent<IProps> = ({ stepTitle }) => {

  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(position => {
      reverseGeolocate(
        position.coords.longitude.toString(),
        position.coords.latitude.toString()
      );
    });
  };

  const reverseGeolocate = async (lon: string, lat: string) => {
    await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&result_type=postal_code&key=${process.env.REACT_APP_GOOGLE_API_KEY}`
    )
      .then(response => {
        const location = response.data.results[0].formatted_address;
        quizStore.setStep1(location);
      })
      .catch(() => {
        alert('Sorry. We are currently unable to determine your location.');
      });
  };

  return (
    <Fragment>
      <div className="quiz-modal__step">
        <div className="quiz-modal__step_number">
          <span>1</span>
          <span>from 5</span>
        </div>
        <div className="quiz-modal__step_title">{stepTitle}</div>
      </div>
      <h4 className="modal__title quiz-modal__title">
        Please add post code or location so we can display the opportunities nearest to you
      </h4>
      <div className="quiz-modal__content">
        <p className="helper">e.g SW16 7GZ or Camden</p>
        <Input
          id="location"
          type="text"
          onChange={e => quizStore.setStep1(e.target.value)}
          value={quizStore.step1}
        />
        <button
          type="button"
          className="quiz-modal__link_location"
          onClick={(e) => {
            e.preventDefault();
            getLocation();
          }}><FontAwesomeIcon icon="search-location" className="link__icon--left" />or use current location</button>
      </div>
    </Fragment>
  );
};

export default observer(Step1);
