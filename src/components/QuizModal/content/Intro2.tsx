import React, { Fragment, FunctionComponent } from 'react';
import '../QuizModal.scss';

const Intro2: FunctionComponent = () => {
  return (
    <Fragment>
      <h4 className="modal__title quiz-modal__title">Here you can find a range of local opportunities for you to become more physically active</h4>
      <div className="quiz-modal__content">
        <p>
          Start by asking yourself a few questions:
        </p>
        <ul>
          <li>How would life be better if you were more physically active?</li>
          <li>Are their physical activities you have enjoyed in the past?</li>
          <li>What have you always wanted to do?</li>
          <li>What do you not want to do?</li>
        </ul>
      </div>
    </Fragment>
  );
};

export default Intro2;
