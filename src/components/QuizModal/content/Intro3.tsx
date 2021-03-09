import React, { Fragment, FunctionComponent } from 'react';
import cx from 'classnames';
import '../QuizModal.scss';
import quizStore from '../../../stores/quizStore';
import { observer } from 'mobx-react';

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

const Intro3: FunctionComponent = () => {
  return (
    <Fragment>
      <h4 className="modal__title quiz-modal__title">What is your main reason for wanting to be more physically active?</h4>
      <small>Please choose up to three reasons</small>
      <div className="quiz-modal__content">
        <ul className="intro3">
          {selectionMapping.map((item, index) => (
            <li
              key={index}
              className={cx({ "active" : quizStore.intro3.includes(index) })}
              onClick={() => quizStore.setIntro3(index)}
            >{item}</li>
          ))}
        </ul>
      </div>
    </Fragment>
  );
};

export default observer(Intro3);
