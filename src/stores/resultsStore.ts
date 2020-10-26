import { observable, action, computed } from 'mobx';
import forEach from 'lodash/forEach';
import get from 'lodash/get';
import size from 'lodash/size';
import axios from 'axios';
import queryString from 'query-string';

import { apiBase, nhsApiSubscriptionKey } from '../config/api';
import {
  IParams,
  IPersona,
  IOrganisation,
  IService,
  IGeoLocation,
} from '../types/types';

import { queryRegex, querySeparator } from '../utils/utils';

export default class ResultsStore {
  @observable keyword: string = '';
  @observable category: any;
  @observable persona: IPersona | null = null;
  @observable categories: [] | null = [];
  @observable personas: [] | null = [];
  @observable taxonomyCategory: any;
  @observable taxonomyOrganisation: any;
  @observable organisations: IOrganisation[] | null = [];
  @observable is_free: boolean = false;
  @observable order: 'relevance' | 'distance' = 'relevance';
  @observable results: Map<string, IService[]> = new Map();
  @observable nationalResults: Map<string, IService[]> = new Map();
  @observable nhsResult: any;
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
  get isPostcodeSearch() {
    return !!this.postcode;
  }

  @action
  clear() {
    this.keyword = '';
    this.category = '';
    this.persona = null;
    this.categories = null;
    this.personas = null;
    this.taxonomyCategory = '';
    this.taxonomyOrganisation = '';
    this.is_free = false;
    this.order = 'relevance';
    this.results = new Map();
    this.nationalResults = new Map();
    this.nhsResult = '';
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
  getAllCollections = async () => {
    axios
      .get(`${apiBase}/collections/categories`)
      .then(response => get(response, 'data.data'))
      .then(data => this.categories = data)
      .catch(error => console.error(error));

    axios
      .get(`${apiBase}/collections/personas`)
      .then(response => get(response, 'data.data'))
      .then(data => this.personas = data)
      .catch(error => console.error(error));
  };

  @action
  getCategory = async (slug: string) => {
    return axios
      .get(`${apiBase}/collections/categories/${slug}`)
      .then(response => get(response, 'data.data'))
      .then(data => this.category = data)
      .then(() => this.setParams())
      .catch(error => console.error(error));
  };

  @action
  getPersona = async (slug: string) => {
    return axios
      .get(`${apiBase}/collections/personas/${slug}`)
      .then(response => get(response, 'data.data'))
      .then(data => this.persona = data)
      .then(() => this.setParams())
      .catch(error => console.error(error));
  };

  @action
  getTaxonomiesCategory = async (slug: string) => {
    return axios
      .get(`${apiBase}/taxonomies/categories/${slug}`)
      .then(response => get(response, 'data.data'))
      .then(data => this.taxonomyCategory = data)
      .catch(error => console.error(error));
  };

  @action
  getTaxonomiesOrganisation = async (slug: string) => {
    return axios
      .get(`${apiBase}/taxonomies/organisations/${slug}`)
      .then(response => get(response, 'data.data'))
      .then(data => this.taxonomyOrganisation = data)
      .catch(error => console.error(error));
  };

  getSearchTerms = () => {
    const searchTerms = queryString.parse(window.location.search);

    this.setSearchTerms(searchTerms);
  };

  @action
  setSearchTerms = async (searchTerms: { [key: string]: any }) => {
    forEach(searchTerms, (key, value) => {
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

    if (this.postcode) {
      await this.geolocate();
    }

    this.setParams();
  };

  setParams = async () => {
    const params: IParams = {};

    if (this.is_free) {	
      params.is_free = this.is_free;	
    }

    if (this.view) {	
      params.view = this.view;
    }

    if (this.keyword) {
      params.query = this.keyword;
    }

    if (this.category) {
      params.category = this.category.name;
    }

    if (this.persona) {
      params.persona = this.persona.name;
    }

    if (size(this.locationCoords)) {
      params.location = this.locationCoords;
    }

    params.order = this.order;

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
    let searchUrl;

    if(isNational) {
      itemsPerPage = Math.round(this.itemsPerPage / 2);
    } else {
      itemsPerPage = this.itemsPerPage;
    }
    
    if(this.category || this.persona) {
      searchUrl = `${apiBase}/search?page=${this.currentPage}`;
    } else if(this.view === 'map') {
      searchUrl = `${apiBase}/search`;
    } else {
      searchUrl = `${apiBase}/search?page=${this.currentPage}&per_page=${itemsPerPage}`;
    }

    const { data } = await axios.post(searchUrl, params);
    this.totalItems += get(data, 'meta.total', 0);

    if(!isNational) {
      this.results = this.results.set(params.query as string, data.data);
    } else {
      this.nationalResults = this.nationalResults.set(params.query as string, data.data);
    }

    if(this.keyword) {
      await this.fetchNhsConditions();
    }

    this.getOrganisations();
  };

  @action
  fetchNhsConditions = async () => {
    await axios.get('https://api.nhs.uk/conditions/' + this.keyword.replace(/\s+/g, '-').toLowerCase(), {
      headers: {
        'subscription-key': `${nhsApiSubscriptionKey}`,
      },
    })
    .then(response => {
      this.nhsResult = response.data;
    })
    .catch(error => {
      this.nhsResult = null;
    });
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

    this.currentPage = 1;
    url = this.updateQueryStringParameter('page', this.currentPage);

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
      
      if(location) {
        this.locationCoords = {
          lon: location.lng,
          lat: location.lat,
        };
      } else {
        alert('we could not find a location for the address entered');
      }
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
