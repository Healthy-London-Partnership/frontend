import React, { Fragment, FunctionComponent } from 'react';
import '../QuizModal.scss';
import quizStore from '../../../stores/quizStore';
import { observer } from 'mobx-react';

const metaOld = ['12-18', '19-34', '35-48', '49-64', '65-78', '79 and over'];

interface IProps {
  stepTitle?: string;
}

const Step2: FunctionComponent<IProps> = ({ stepTitle }) => {
  return (
    <Fragment>
      <div className="quiz-modal__step">
        <div className="quiz-modal__step_number">
          <span>2</span>
          <span>from 5</span>
        </div>
        <div className="quiz-modal__step_title">{stepTitle}</div>
      </div>
      <h4 className="modal__title quiz-modal__title">How old are you?</h4>
      <small>Please choose your age range so we can suggest activities that suit you best.</small>
      <div className="quiz-modal__content">
        <div className="radio-selection-wrapper">
          {metaOld.map((item, index) => (
            <div key={index} className="radio-selection" onClick={() => quizStore.setStep2(index)}>
              <div className={`circle ${quizStore.step2 === index ? 'circle-active' : ''}`} />
              <label>{item}</label>
            </div>
          ))}
        </div>
      </div>
    </Fragment>
  );
};

export default observer(Step2);
