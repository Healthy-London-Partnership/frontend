import { observable, action } from 'mobx';
import get from 'lodash/get';
import axios from 'axios';

import { apiBase } from '../config/api';

export default class CollectionsStore {
  @observable collection: any;

  @action
  clear() {
    this.collection = '';
  }

  @action
  getCollection = (slug: string) => {
      return axios
        .get(`${apiBase}/collections/categories/${slug}`)
        .then(response => get(response, 'data.data'))
        .then(data => this.collection = data)
        .catch(error => console.error(error));
  };
}