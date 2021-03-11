import { observable, action } from 'mobx';

interface IStep5 {
  full_name: string;
  email: string;
  phone: string;
}

class QuizStore {
  @observable step: number = 1;
  @observable maxStep: number = 8;
  @observable disableNext: boolean = false;

  @observable intro3: any = [];
  @observable step1: string = '';
  @observable step2: string = '';
  @observable step3: string = '';
  @observable step4: string = '';
  @observable step5: IStep5 = {
    full_name: '',
    email: '',
    phone: '',
  };

  @action
  setDisableNext = (value: boolean) => {
    this.disableNext = value;
  };

  @action
  nextStep = () => {
    this.step = this.step === this.maxStep ? this.maxStep : this.step + 1;
  };

  @action
  backStep = () => {
    this.step = this.step === 1 ? 1 : this.step - 1;
  };

  @action
  setIntro3 = (key: number) => {
    if (this.intro3.includes(key)) {
      this.intro3.splice(this.intro3.indexOf(key), 1);
    } else {
      this.intro3.push(key);
    }
  };

  @action
  setStep1 = (value: string) => {
    this.step1 = value;
  };

  @action
  setStep2 = (value: string) => {
    this.step2 = value;
  };

  @action
  setStep3 = (value: string) => {
    this.step3 = value;
  };

  @action
  setStep4 = (value: string) => {
    this.step4 = value;
  };

  @action
  setField = (field: string, data: string, step: string) => {
    // @ts-ignore
    this[step][field] = data;
  };

}

const quizStore = new QuizStore();

export default quizStore;
