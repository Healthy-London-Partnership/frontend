import { observable, action } from 'mobx';
import axios from 'axios';
import { apiBase } from '../config/api';
import get from 'lodash/get';

class QuizStore {
  @observable step: number = 1;
  @observable maxStep: number = 8;

  @observable feedback: string = '';
  @observable name: string = '';
  @observable email: string = '';
  @observable phone: string = '';
  @observable submitted: boolean = false;

  @action
  nextStep = () => {
    this.step = this.step === this.maxStep ? this.maxStep : this.step + 1;
  };

  @action
  backStep = () => {
    this.step = this.step === 1 ? 1 : this.step - 1;
  };

  @action
  setField = (field: string, data: string) => {
    // @ts-ignore
    this[field] = data;
  };

  submitFeedback = async () => {
    const params = {
      name: this.name,
      feedback: this.feedback,
      email: this.email,
      phone: this.phone,
      url: window.location.href,
    };

    try {
      const feedback = await axios.post(`${apiBase}/page-feedbacks`, params);

      if (get(feedback, 'data')) {
        this.submitted = true;
      }
    } catch (e) {
      console.error(e);
    }
  };
}

const quizStore = new QuizStore();

export default quizStore;
