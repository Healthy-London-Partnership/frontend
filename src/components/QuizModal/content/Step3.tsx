import React, {Fragment, FunctionComponent, useEffect} from 'react';
import '../QuizModal.scss';
import cx from 'classnames';
import quizStore from '../../../stores/quizStore';
import { observer } from 'mobx-react';

// const selectionMapping = ['Low', 'Medium', 'High'];

const selectionMapping = [
  { label: 'Low', value: 'low' },
  { label: 'Medium', value: 'medium' },
  { label: 'High', value: 'high' },
];

interface IProps {
  stepTitle?: string;
}

const Step3: FunctionComponent<IProps> = ({ stepTitle }) => {
  useEffect(() => {
    quizStore.setDisableNext(true);

    if (quizStore.step3 !== '') {
      quizStore.setDisableNext(false);
    };
  });

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
          {selectionMapping.map(item => (
            <li
              key={item.value}
              className={cx({ "active" : quizStore.step3 === item.value })}
              onClick={() => quizStore.setStep3(item.value)}
            >{item.label}</li>
          ))}
        </ul>
      </div>
    </Fragment>
  );
};

export default observer(Step3);
