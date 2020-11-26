import { observable, action } from 'mobx';
import axios from 'axios';
import get from 'lodash/get';

import { apiBase } from '../config/api';
import {
  ICategory,
  IPersona
} from '../types/types';

class SearchStore {
  @observable categories: ICategory[] = [];
  @observable personas: IPersona[] = [];
  @observable categoryId: string = '';

  constructor() {
    this.getCategories();
    this.getPersonas();
  }

  @action clear = () => {
    this.categoryId = '';
  };

  @action setCategory = (e: React.ChangeEvent<HTMLSelectElement>) => {
    this.categoryId = e.target.value;
  };

  @action
  getCategories = async () => {
    try {
      const categories = await axios.get(`${apiBase}/collections/categories?page=1`);
      const categoryList = get(categories, 'data.data', []);

      // only display categories with the `Homepage:` prefix
      const homepageCategories = categoryList.filter((category: ICategory) =>
        category.name.includes('Homepage:')
      );

      homepageCategories.forEach(
        (category: ICategory) => (category.name = category.name.replace('Homepage:', ''))
      );

      this.categories = homepageCategories;
      console.log(this.categories);
    } catch (e) {
      console.error(e);
    }
  };

  @action
  getPersonas = async () => {
    try {
      const personas = await axios.get(`${apiBase}/collections/personas`);
      this.personas = get(personas, 'data.data', []);
    } catch (e) {
      console.error(e);
    }
  };
}

export default new SearchStore();
