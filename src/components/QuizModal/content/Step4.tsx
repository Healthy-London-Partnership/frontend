import React, { Fragment, FunctionComponent } from 'react';
import '../QuizModal.scss';

const selectionMapping = ['Free only', 'Paid only', 'Both'];

interface IProps {
  stepTitle?: string;
}

const Step4: FunctionComponent<IProps> = ({ stepTitle }) => {
  return (
    <Fragment>
      <div className="quiz-modal__step">
        <div className="quiz-modal__step_number">
          <span>4</span>
          <span>from 5</span>
        </div>
        <div className="quiz-modal__step_title">{stepTitle}</div>
      </div>
      <h4 className="modal__title quiz-modal__title">Do you want to see free or pay for options?</h4>
      <div className="quiz-modal__content">
        <ul className="step-card-selection">
          {selectionMapping.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
    </Fragment>
  );
};

export default Step4;
