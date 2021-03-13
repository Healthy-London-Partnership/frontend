import React, { Fragment, FunctionComponent } from 'react';
import '../QuizModal.scss';

const Intro1: FunctionComponent = () => {
  return (
    <Fragment>
      <h4 className="modal__title quiz-modal__title">
        Let’s find some physical that is right for you!<br/>
        Complete this one minute quiz
      </h4>
      <div className="quiz-modal__content">
        <p>
          Your answers are confidential and are used to ensure you get the right support.
          For more details click here
        </p>
      </div>
    </Fragment>
  );
};

export default Intro1;
