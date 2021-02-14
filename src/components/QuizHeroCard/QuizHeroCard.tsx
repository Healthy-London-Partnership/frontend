import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import UIStore from '../../stores/uiStore';

import './QuizHeroCard.scss';
import Button from '../Button';
import PhysicalActivityImg from '../../assets/images/illustrations/physical-activity.svg';
import QuizModal from '../QuizModal/QuizModal';

import { RouteComponentProps, withRouter } from 'react-router';

interface IProps extends RouteComponentProps {
  title: string;
  uiStore?: UIStore;
}

@inject('uiStore')
@observer
class QuizHeroCard extends Component<IProps, any> {
  render() {
    const { uiStore, title } = this.props;

    return (
      <div className="quiz-hero">
        <div className="flex-container flex-container--justify">
          <div className="flex-col flex-col--10">
            <div className="quiz-hero__wrapper">
              <div className="flex-container flex-container--no-padding flex-container--no-space flex-container--wrap">
                <div className="flex-col">
                  <img
                    src={PhysicalActivityImg}
                    alt="Physical Activity"
                    className="quiz-hero__image"
                  />
                </div>
                <div className="flex-col flex-col--9 flex-col--standard--12">
                  <h2 className="quiz-hero__title">{title}</h2>
                  <p className="quiz-hero__description">
                    To help you find the opportunity that is right for you, we’d like to ask a few questions, in complete confidence.
                  </p>
                  <Button text="Take the Quiz" size="small" onClick={() => uiStore?.toggleQuizModal()}/>
                </div>
              </div>
            </div>
          </div>
        </div>
        <QuizModal />
      </div>
    );
  }
}

export default withRouter(observer(QuizHeroCard));
