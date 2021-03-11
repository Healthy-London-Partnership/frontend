import React, {Fragment, FunctionComponent, useEffect} from 'react';
import '../QuizModal.scss';
import quizStore from '../../../stores/quizStore';
import { observer } from 'mobx-react';

const metaOld = [
  { label: '12-18', value: '12-18' },
  { label: '19-34', value: '19-34' },
  { label: '35-48', value: '35-48' },
  { label: '49-64', value: '49-64' },
  { label: '65-78', value: '65-78' },
  { label: '79 and over', value: '79-100' },
];

interface IProps {
  stepTitle?: string;
}

const Step2: FunctionComponent<IProps> = ({ stepTitle }) => {
  useEffect(() => {
    quizStore.setDisableNext(true);

    if (quizStore.step2 !== '') {
      quizStore.setDisableNext(false);
    };
  });

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
          {metaOld.map(item => (
            <div
              key={item.value}
              className="radio-selection"
              onClick={() => quizStore.setStep2(item.value)}
            >
              <div className={`circle ${quizStore.step2 === item.value ? 'circle-active' : ''}`} />
              <label>{item.label}</label>
            </div>
          ))}
        </div>
      </div>
    </Fragment>
  );
};

export default observer(Step2);
