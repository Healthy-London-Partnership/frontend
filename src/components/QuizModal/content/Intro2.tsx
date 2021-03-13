import React, { Fragment, FunctionComponent } from 'react';
import '../QuizModal.scss';

const Intro2: FunctionComponent = () => {
  return (
    <Fragment>
      <h4 className="modal__title quiz-modal__title">Here you can find a range of local opportunities for you to become more physically active</h4>
      <div className="quiz-modal__content">
        <p>
          We suggest you start by asking yourself a few questions:
        </p>
        <ul>
          <li>What do you see as the benefits to you of being more physically active?</li>
          <li>Is there a form of physical activity that you have enjoyed in the past?</li>
          <li>Is there a type of activity you’ve always wanted to do?</li>
          <li>What do you Not want to do?!</li>
        </ul>
      </div>
    </Fragment>
  );
};

export default Intro2;
