import React, { Fragment, FunctionComponent } from 'react';
import '../QuizModal.scss';

const Intro1: FunctionComponent = () => {
  return (
    <Fragment>
      <h4 className="modal__title quiz-modal__title">Please complete this one minute quiz</h4>
      <div className="quiz-modal__content">
        <p>
          Your answers remain strictly confidential and are only used to ensure you get the support
          you need and want. For more about how we use your information please see here
        </p>
      </div>
    </Fragment>
  );
};

export default Intro1;
