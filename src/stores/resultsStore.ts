import { observable, action, computed } from 'mobx';
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
  @observable is_free: boolean = false;
  @observable order: 'relevance' | 'distance' = 'relevance';
  @observable results: Map<string, IService[]> = new Map();
  @observable nationalResults: Map<string, IService[]> = new Map();
  @observable loading: boolean = false;
  @observable currentPage: number = 1;
  @observable totalItems: number = 0;
  @observable itemsPerPage: number = 9;
  @observable postcode: string = '';
  @observable locationCoords: IGeoLocation | {} = {};
  @observable fetched: boolean = false;
  @observable view: 'grid' | 'map' = 'grid';

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

  @computed
  get isPostcodeSearch() {
    return !!this.postcode;
  }

  @action
  clear() {
    this.keyword = '';
    this.categoryIds = [];
    this.categories = [];
    this.personaId = '';
    this.persona = null;
    this.is_free = false;
    this.order = 'relevance';
    this.results = new Map();
    this.nationalResults = new Map();
    this.fetched = false;
    this.organisations = [];
    this.currentPage = 1;
    this.totalItems = 0;
    this.itemsPerPage = 9;
    this.postcode = '';
    this.locationCoords = {};
    this.view = 'grid';
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

      if (value === 'is_free') {
        this.is_free = key === 'true' ? true : false;	
      }

      if (value === 'view') {
        this.view = key;	
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
    // const categories = map(this.categories, 'name');

    if (this.persona) {
      params.persona = get(this.persona, 'name');
    }

    if (this.is_free) {	
      params.is_free = this.is_free;	
    }

    if (this.view) {	
      params.view = this.view;
    }

    if (this.keyword) {
      params.query = this.keyword;
    }

    if (size(this.locationCoords)) {
      params.location = this.locationCoords;
    }

    params.order = this.order;

    params.is_national = false;

    await this.fetchResults(false, params);

    if(this.view !== 'map' && this.postcode !== '') {
      params.is_national = true;
      delete params['location'];

      await this.fetchResults(true, params);
    }
  };

  @action
  fetchResults = async (isNational: boolean, params: IParams) => {
    let itemsPerPage;

    if(isNational) {
      itemsPerPage = Math.round(this.itemsPerPage / 2);
    } else {
      itemsPerPage = this.itemsPerPage;
    }

    const { data } = await axios.post(`${apiBase}/search?page=${this.currentPage}&per_page=${itemsPerPage}`, params);
    this.totalItems += get(data, 'meta.total', 0);

    if(!isNational) {
      this.results = this.results.set(params.query as string, data.data);
    } else {
      this.nationalResults = this.nationalResults.set(params.query as string, data.data);
    }

    this.getOrganisations();
  };

  @action
  ordered = () => {
    const categories = map(this.categories, 'name');
    // reorder categories based on list in URL
    const order = [...this.results.entries()].sort((a, b) => {
      return categories.indexOf(a[0]) - categories.indexOf(b[0]);
    });

    this.results = new Map(order);
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
    this.fetched = true;
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

  amendSearch = () => {
    let url = window.location.search;

    if (this.postcode) {
      url = this.updateQueryStringParameter('postcode', this.postcode);
    }

    if (!this.postcode) {
      url = this.removeQueryStringParameter('postcode', url);
      this.locationCoords = {};
    }

    if (this.is_free) {	
      url = this.updateQueryStringParameter('is_free', this.is_free, url);	
    }	

    if (!this.is_free) {	
      url = this.removeQueryStringParameter('is_free', url);	
    }

    if (this.view) {	
      url = this.updateQueryStringParameter('view', this.view, url)
    }	

    if (this.keyword) {
      url = this.updateQueryStringParameter('search_term', this.keyword, url);
    }

    if (!this.keyword) {
      url = this.removeQueryStringParameter('search_term', url);
    }

    this.results = new Map();
    this.nationalResults = new Map();
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
  handleKeywordChange = (value: string) => {
    this.keyword = value;
  };

  @action	
  toggleView = (view: 'map' | 'grid') => {	
    this.view = view;
  };

  @action
  orderResults = (e: React.ChangeEvent<HTMLSelectElement>) => {
    this.order = e.target.value as 'relevance' | 'distance';
    this.results = new Map();
    this.nationalResults = new Map();

    this.setParams();
  };
  
  @action	
  toggleIsFree = () => {
    this.is_free = !this.is_free;
  };

  @action	
  paginate = (page: number) => {	
    this.currentPage = page;	
    this.results = new Map();
    this.nationalResults = new Map();
    this.loading = true;	
  };
}
