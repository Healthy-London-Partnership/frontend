import { observable, action, computed, toJS } from 'mobx';
import forEach from 'lodash/forEach';
import get from 'lodash/get';
import size from 'lodash/size';
import axios from 'axios';
import queryString from 'query-string';
import map from 'lodash/map';

import { apiBase } from '../config/api';
import {
  IParams,
  ICategory,
  IPersona,
  IOrganisation,
  IService,
  IGeoLocation,
} from '../types/types';

import { queryRegex, querySeparator } from '../utils/utils';

export default class ResultsStore {
  @observable keyword: string = '';
  @observable categoryIds: string[] = [];
  @observable categories: ICategory[] = [];
  @observable personaId: string = '';
  @observable persona: IPersona | null = null;
  @observable organisations: IOrganisation[] | null = [];
  @observable order: 'relevance' | 'distance' = 'relevance';
  @observable results: Map<string, IService[]> = new Map();
  @observable loading: boolean = false;
  @observable currentPage: number = 1;
  @observable totalItems: number = 0;
  @observable itemsPerPage: number = 25;
  @observable postcode: string = '';
  @observable locationCoords: IGeoLocation | {} = {};

  @computed
  get isKeywordSearch() {
    return !!this.keyword;
  }

  @computed
  get isPersonaSearch() {
    return !!this.persona;
  }

  @computed
  get isCategorySearch() {
    return !!this.categoryIds.length;
  }

  @action
  clear() {
    this.keyword = '';
    this.categoryIds = [];
    this.categories = [];
    this.personaId = '';
    this.persona = null;
    this.order = 'relevance';
    this.results = new Map();
    this.loading = false;
    this.organisations = [];
    this.currentPage = 1;
    this.totalItems = 0;
    this.itemsPerPage = 25;
    this.postcode = '';
    this.locationCoords = {};
  }

  @action
  getCategory = () => {
    return Promise.all(
      this.categoryIds.map((id: string) => {
        return axios
          .get(`${apiBase}/collections/categories/${id}`)
          .then(response => get(response, 'data.data'))
          .then(data => this.categories.push(data))
          .catch(error => console.error(error));
      })
    );
  };

  @action
  getPersona = async () => {
    try {
      const persona = await axios.get(`${apiBase}/collections/personas/${this.personaId}`);
      this.persona = get(persona, 'data.data', '');
    } catch (e) {
      console.error(e);
    }
  };

  getSearchTerms = () => {
    const searchTerms = queryString.parse(window.location.search);

    this.setSearchTerms(searchTerms);
  };

  @action
  setSearchTerms = async (searchTerms: { [key: string]: any }) => {
    forEach(searchTerms, (key, value) => {
      if (value === 'category') {
        this.categoryIds = key.split(',');
      }

      if (value === 'persona') {
        this.personaId = key;
      }

      if (value === 'search_term') {
        this.keyword = key;
      }

      if (value === 'page') {
        this.currentPage = Number(key);
      }

      if (value === 'postcode') {
        this.postcode = key;
      }
    });

    if (this.categoryIds) {
      await this.getCategory();
    }

    if (this.personaId) {
      await this.getPersona();
    }

    if (this.postcode) {
      await this.geolocate();
    }

    this.setParams();
  };

  setParams = async () => {
    const params: IParams = {};
    const categories = map(this.categories, 'name');

    if (this.persona) {
      params.persona = get(this.persona, 'name');
    }

    if (this.keyword) {
      params.query = this.keyword;
    }

    if (size(this.locationCoords)) {
      params.location = this.locationCoords;
    }

    params.order = this.order;

    await this.fetchResults(params, categories);
  };

  @action
  fetchResults = async (params: IParams, categories: string[]) => {
    this.loading = true;

    if (this.isKeywordSearch || this.isPersonaSearch) {
      const { data } = await axios.post(`${apiBase}/search?page=${this.currentPage}`, params);
      this.results = this.results.set(params.query as string, data.data);
      this.getOrganisations();
    } else {
      Promise.all(
        categories.map((category: string) => {
          const requestParams = { category, ...params };

          return axios
            .post(`${apiBase}/search?page=${this.currentPage}`, requestParams)
            .then(response => get(response, 'data.data'))
            .then(data => {
              this.results = this.results.set(category, data);

              if (this.results.size) {
                this.getOrganisations();
              }
            })
            .catch(error => {
              console.error(error);
              this.loading = false;
            });
        })
      );
    }
  };

  @action
  getOrganisations = async () => {
    this.results.forEach((services: any) => {
      services.forEach((service: IService) => {
        // @ts-ignore
        this.organisations.push(service.organisation_id);
      });
    });

    const organisations = await axios.get(
      `${apiBase}/organisations?filter[id]=${this.organisations}`
    );
    this.organisations = get(organisations, 'data.data', []);
    this.loading = false;
  };

  updateQueryStringParameter = (
    key: string,
    value: string | boolean | number,
    query: string = window.location.search
  ) => {
    const re = queryRegex(key);
    const separator = querySeparator(query);

    if (query.match(re)) {
      return query.replace(re, `$1${key}=${value}$2`);
    } else {
      return `${query}${separator}${key}=${value}`;
    }
  };

  removeQueryStringParameter = (key: string, query: string = window.location.search) => {
    const re = queryRegex(key);

    if (query.match(re)) {
      return query.replace(re, '$2');
    }

    return query;
  };

  @action
  postcodeChange = (postcode: string) => {
    this.postcode = postcode.replace(' ', '');
  };

  amendSearch = (searchTerm?: string) => {
    let url = window.location.search;

    if (this.postcode) {
      url = this.updateQueryStringParameter('postcode', this.postcode);
    }

    if (!this.postcode) {
      url = this.removeQueryStringParameter('postcode', url);
      this.locationCoords = {};
    }

    if (searchTerm) {
      url = this.updateQueryStringParameter('search_term', searchTerm, url);
    }

    this.results = new Map();
    return url;
  };

  @action
  geolocate = async () => {
    try {
      const geolocation = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${this.postcode},UK&key=${process.env.REACT_APP_GOOGLE_API_KEY}`
      );

      const location = get(geolocation, 'data.results[0].geometry.location', {});

      this.locationCoords = {
        lon: location.lng,
        lat: location.lat,
      };
    } catch (e) {
      console.error(e);
    }
  };

  @action
  handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.keyword = e.target.value;
  };

  @action
  orderResults = (e: React.ChangeEvent<HTMLSelectElement>) => {
    this.order = e.target.value as 'relevance' | 'distance';
    this.results = new Map();

    this.setParams();
  };
}
