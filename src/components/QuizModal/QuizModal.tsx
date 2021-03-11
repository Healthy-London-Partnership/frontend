import React, { Component } from 'react';
import Modal from 'react-modal';
import { inject, observer } from 'mobx-react';
import UIStore from '../../stores/uiStore';
import ResultsStore from '../../stores/resultsStore';
import quizStore from '../../stores/quizStore';

import './QuizModal.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { RouteComponentProps, withRouter } from 'react-router';

import Intro1 from './content/Intro1';
import Intro2 from './content/Intro2';
import Intro3 from './content/Intro3';
import Step1 from './content/Step1';
import Step2 from './content/Step2';
import Step3 from './content/Step3';
import Step4 from './content/Step4';
import Step5 from './content/Step5';

interface IProps extends RouteComponentProps {
  uiStore?: UIStore;
  resultsStore?: ResultsStore;
}

@inject('uiStore', 'resultsStore')
@observer
class QuizModal extends Component<IProps, any> {
  handleNextStep = () => {
    const { uiStore, resultsStore } = this.props;
    const { step, maxStep, nextStep } = quizStore;

    nextStep();
    if (step === maxStep) {
      uiStore?.toggleQuizModal();
      resultsStore?.getResultByQuiz(
        quizStore.step1,
        quizStore.step2
      );
    }
  };

  handleBackStep = () => {
    const { backStep } = quizStore;
    backStep();
  };

  render() {
    const { uiStore, resultsStore } = this.props;

    if (!uiStore || !resultsStore) {
      return null;
    }

    // const { step } = this.state;
    const { step } = quizStore;

    return (
      <Modal isOpen={uiStore.quizModalOpen} className="quiz-modal" shouldCloseOnEsc={true}>
        <div className="flex-container">
          <div className="flex-col flex-col--12 quiz-modal__close modal__close">
            <button onClick={uiStore.toggleQuizModal} aria-label="Close modal">
              Close <FontAwesomeIcon icon="times" />
            </button>
          </div>
          <div className="flex-col flex-col--12 ">
            {step === 1 && <Intro1 />}
            {step === 2 && <Intro2 />}
            {step === 3 && <Intro3 />}
            {step === 4 && <Step1 stepTitle={resultsStore?.keyword} />}
            {step === 5 && <Step2 stepTitle={resultsStore?.keyword} />}
            {step === 6 && <Step3 stepTitle={resultsStore?.keyword} />}
            {step === 7 && <Step4 stepTitle={resultsStore?.keyword} />}
            {step === 8 && <Step5 stepTitle={resultsStore?.keyword} />}
            <div className="quiz-modal__footer">
              <button
                className="quiz-modal__footer__button quiz-modal__footer__button__back"
                onClick={this.handleBackStep}
              >
                <FontAwesomeIcon icon="chevron-left" /> Back
              </button>
              <button
                className="quiz-modal__footer__button quiz-modal__footer__button__next"
                onClick={this.handleNextStep}
                disabled={quizStore.disableNext}
              >
                {step === 8 ? 'Show Result' : 'Next'} <FontAwesomeIcon icon="chevron-right" />
              </button>
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}

Modal.setAppElement('#root');

export default withRouter(observer(QuizModal));