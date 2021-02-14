import React, { Fragment, FunctionComponent, useState } from 'react';
import '../QuizModal.scss';

import Input from '../../Input';

interface IProps {
  stepTitle?: string;
}

const Step1: FunctionComponent<IProps> = ({ stepTitle }) => {
  const [location, setLocation] = useState('');

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
          onChange={e => setLocation(e.target.value)}
          value={location}
        />
      </div>
    </Fragment>
  );
};

export default Step1;
