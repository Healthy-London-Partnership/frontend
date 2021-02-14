import React, { Fragment, FunctionComponent } from 'react';
import '../QuizModal.scss';

const selectionMapping = [
  'Lose Weight',
  'Improve my muscle strength',
  'Improve my appearance',
  'Improve mental well being',
  'Improve overall fitness',
  'Relieve muscle and bone pain',
  'Improve self esteem',
  'Improve my heart’s health',
  'Be more flexible',
  'Meet other people',
];

const Intro2: FunctionComponent = () => {
  return (
    <Fragment>
      <h4 className="modal__title quiz-modal__title">What is your main reason for wanting to be more physically active?</h4>
      <small>Please choose up to three reasons</small>
      <div className="quiz-modal__content">
        <ul className="intro3">
          {selectionMapping.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
    </Fragment>
  );
};

export default Intro2;
