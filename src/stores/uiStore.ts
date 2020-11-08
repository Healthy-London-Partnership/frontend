import { observable, action } from 'mobx';

export default class UIStore {
  @observable burgerMenuOpen: boolean = false;
  @observable feedbackModalOpen: boolean = false;
  @observable locationModalOpen: boolean = false;
  @observable keywordEditOpen: boolean = false;

  @action
  toggleBurgerMenu = () => {
    this.burgerMenuOpen = !this.burgerMenuOpen;
  };

  @action
  toggleFeedbackModal = () => {
    this.feedbackModalOpen = !this.feedbackModalOpen;
  };

  @action
  toggleLocationModal = () => {
    this.locationModalOpen = !this.locationModalOpen;
  };

  @action
  toggleKeywordEdit = () => {
    this.keywordEditOpen = !this.keywordEditOpen;
  };
}
