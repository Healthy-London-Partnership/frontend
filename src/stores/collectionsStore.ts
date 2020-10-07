import { observable, action } from 'mobx';
import get from 'lodash/get';
import axios from 'axios';

import { apiBase } from '../config/api';
import {
  IParams,
  IService,
} from '../types/types';

export default class CollectionsStore {
  @observable collection: any;
  @observable totalItems: number = 0;
  @observable order: 'relevance' | 'distance' = 'relevance';
  @observable results: Map<string, IService[]> = new Map();

  @action
  clear() {
    this.collection = '';
    this.totalItems = 0;
    this.order = 'relevance';
    this.results = new Map();
  }

  @action
  getCollection = async (slug: string) => {
    return axios
      .get(`${apiBase}/collections/categories/${slug}`)
      .then(response => get(response, 'data.data'))
      .then(data => this.collection = data)
      .then(() => this.setParams())
      .catch(error => console.error(error));
  };

  setParams = async () => {
    const params: IParams = {};

    params.order = this.order;

    params.category = this.collection.id;

    await this.fetchResults(params);
  };

  @action
  fetchResults = async (params: IParams) => {
    const { data } = await axios.post(`${apiBase}/search`, params);
    this.totalItems += get(data, 'meta.total', 0);
    this.results = this.results.set(params.query as string, data.data);
  };
}