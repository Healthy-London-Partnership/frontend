import React, { Fragment, FunctionComponent } from 'react';
import '../QuizModal.scss';
import cx from 'classnames';
import quizStore from '../../../stores/quizStore';
import { observer } from 'mobx-react';

const selectionMapping = ['Low', 'Medium', 'High'];

interface IProps {
  stepTitle?: string;
}

const Step3: FunctionComponent<IProps> = ({ stepTitle }) => {
  return (
    <Fragment>
      <div className="quiz-modal__step">
        <div className="quiz-modal__step_number">
          <span>3</span>
          <span>from 5</span>
        </div>
        <div className="quiz-modal__step_title">{stepTitle}</div>
      </div>
      <h4 className="modal__title quiz-modal__title">
        How intense or challenging do you want the activity to be?
      </h4>
      <div className="quiz-modal__content">
        <ul className="step-card-selection">
          {selectionMapping.map((item, index) => (
            <li
              key={index}
              className={cx({ "active" : quizStore.step3 === index })}
              onClick={() => quizStore.setStep3(index)}
            >{item}</li>
          ))}
        </ul>
      </div>
    </Fragment>
  );
};

export default observer(Step3);
