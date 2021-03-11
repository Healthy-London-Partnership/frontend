import { observable, action, computed } from 'mobx';
import forEach from 'lodash/forEach';
import get from 'lodash/get';
import size from 'lodash/size';
import axios from 'axios';
import queryString from 'query-string';

import { apiBase, iminApiKey, iminApiBase } from '../config/api';
import {
  IParams,
  IPersona,
  IOrganisation,
  IService,
  IGeoLocation,
} from '../types/types';

import { queryRegex, querySeparator } from '../utils/utils';

const skos = require('@openactive/skos');

export default class ResultsStore {
  @observable keyword: string = '';
  @observable category: any;
  @observable persona: IPersona | null = null;
  @observable categories: [] | null = [];
  @observable personas: [] | null = [];
  @observable collection_categories: string = '';
  @observable collection_personas: string = '';
  @observable taxonomyCategory: any;
  @observable taxonomyOrganisation: any;
  @observable organisations: IOrganisation[] | null = [];
  @observable is_free: boolean = false;
  @observable order: 'relevance' | 'distance' = 'relevance';
  @observable results: Map<string, IService[]> = new Map();
  @observable nationalResults: Map<string, IService[]> = new Map();
  @observable nhsResult: any;
  @observable isLiveActivity: boolean = false;
  @observable liveActivities: Map<string, IService[]> = new Map();
  @observable loading: boolean = false;
  @observable currentPage: number = 1;
  @observable totalItems: number = 0;
  @observable itemsPerPage: number = 9;
  @observable postcode: string = '';
  @observable locationCoords: IGeoLocation | {} = {};
  @observable fetched: boolean = false;
  @observable view: 'grid' | 'map' = 'grid';
  @observable radius: number = 5;
  @observable activityTypes: any[] | null = [];
  @observable activityType: string = '';
  @observable sortBy: string = 'upcoming-sessions';
  @observable isVirtual: boolean = false;

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
    this.collection_categories = '';
    this.collection_personas = '';
    this.taxonomyCategory = '';
    this.taxonomyOrganisation = '';
    this.is_free = false;
    this.order = 'relevance';
    this.results = new Map();
    this.nationalResults = new Map();
    this.nhsResult = '';
    this.isLiveActivity = false;
    this.liveActivities = new Map();
    this.fetched = false;
    this.organisations = [];
    this.currentPage = 1;
    this.totalItems = 0;
    this.itemsPerPage = 9;
    this.postcode = '';
    this.locationCoords = {};
    this.view = 'grid';
    this.radius = 5;
    this.activityTypes = [];
    this.activityType = '';
    this.sortBy = 'upcoming-sessions';
    this.isVirtual = false;
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
    const url = `${apiBase}/collections/categories/${slug}`;
    return axios
      .get(url)
      .then(response => get(response, 'data.data'))
      .then(data => (this.category = data))
      .then(() => this.setCategoryParams())
      .catch(error => console.error(error));
  };

  @action
  getPersona = async (slug: string) => {
    return axios
      .get(`${apiBase}/collections/personas/${slug}`)
      .then(response => get(response, 'data.data'))
      .then(data => this.persona = data)
      .then(() => this.setPersonaParams())
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

  @action
  getActivityTypes = async () => {
    const { data } = await axios.get("https://openactive.io/activity-list/activity-list.jsonld");
    let scheme = new skos.ConceptScheme(data);

    this.activityTypes = this.renderTree(scheme.getTopConcepts(), []);
  };

  renderTree = (concepts: any, output: any) => {
    output.push({
      value: '',
      text: 'All activity types'
    });

    concepts.forEach((concept: any) => {
      let label = concept.prefLabel;

      if (concept.altLabel && concept.altLabel.length > 0) {
        label = label + ' / ' + concept.altLabel.join(' / ')
      }

      output.push({
        value: concept.id.split('#')[1],
        text: label
      });
    });
    return output;
  };

  @action
  getResultByQuiz = async () => {

    const params = {
      'geo[radial]': '51.5454736,-0.1627902,5',
      mode: this.sortBy,
      limit: 9,
      page: 1,
      activityId: this.activityType ? 'https://openactive.io/activity-list#' + this.activityType : null,
      isVirtual: this.isVirtual ? this.isVirtual : null,
    };

    if (this.isVirtual) {
      delete params['geo[radial]'];
    }

    const { data } = await axios.get(`${iminApiBase}`, {
      headers: {
        'X-API-KEY': `${iminApiKey}`,
      },
      params,
    });

    this.totalItems = data['imin:totalItems'];

    if ( this.totalItems > 0) {
      this.results.set('Live Activities', this.transformLiveActivities(data));
    }
    //
    //
    // console.log('getResultByQuiz')
    // this.liveActivities.set('Live Activities', []);
    // this.results = new Map();
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

      if (value === 'live_activity') {
        this.isLiveActivity = key;
      }

      if (value === 'radius') {
        this.radius = key;
      }

      if (value === 'activity_type') {
        this.activityType = key;
      }

      if (value === 'sort_by') {
        this.sortBy = key;
      }

      if (value === 'is_virtual') {
        this.isVirtual = key;
      }

      if (value === 'collection_categories') {
        this.collection_categories = key;
      }

      if (value === 'collection_personas') {
        this.collection_personas = key;
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

    if (this.keyword) {
      params.query = this.keyword;
    }

    if (this.category) {
      params.category = this.category.slug;
    }

    if (this.persona) {
      params.persona = this.persona.slug;
    }

    if (this.collection_categories) {
      params.category = this.collection_categories;
    }

    if (this.collection_personas) {
      params.persona = this.collection_personas;
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

  setCategoryParams = async () => {
    const params: IParams = {};

    if (this.category) {
      params.category = this.category.slug;
    }

    await this.fetchCollectionResults('categories', params);
  };

  setPersonaParams = async () => {
    const params: IParams = {};

    if (this.persona) {
      params.persona = this.persona.slug;
    }

    await this.fetchCollectionResults('personas', params);
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

    if (!isNational) {
      this.results = this.results.set(params.query as string, data.data);
    } else {
      this.nationalResults = this.nationalResults.set(params.query as string, data.data);
    }

    if (this.keyword || this.category || this.persona) {
      await this.fetchNhsConditions();
    }

    if (this.isLiveActivity && params.location) {
      this.fetchLiveActivities(params.location);
    }

    this.getOrganisations();
  };

  @action
  fetchCollectionResults = async (type: string, params: IParams) => {
    let searchUrl;

    searchUrl = `${apiBase}/search/collections/${type}?page=${this.currentPage}`

    const { data } = await axios.post(searchUrl, params);
    this.totalItems += get(data, 'meta.total', 0);

    this.results = this.results.set(params.query as string, data.data);

    this.getOrganisations();
  };

  @action
  fetchNhsConditions = async () => {
    let searchSlug;

    if(this.keyword) {
      searchSlug = this.keyword.replace(/\s+/g, '-').toLowerCase();
    } else if(this.category) {
      searchSlug = this.category.slug.replace('homepage-', '');
    } else if(this.persona) {
      searchSlug = this.persona.slug.replace('homepage-', '');
    }

    await axios.get(apiBase + '/nhs-conditions/' + searchSlug)
    .then(response => {
      this.nhsResult = response.data;
    })
    .catch(error => {
      this.nhsResult = null;
    });
  }

  @action
  fetchLiveActivities = async (location: any) => {

    const params = {
      'geo[radial]': `${location.lat},${location.lon},${this.radius}`,
      mode: this.sortBy,
      limit: 9,
      page: this.currentPage,
      activityId: this.activityType ? 'https://openactive.io/activity-list#' + this.activityType : null,
      isVirtual: this.isVirtual ? this.isVirtual : null,
    };

    if (this.isVirtual) {
      delete params['geo[radial]'];
    }

    const { data } = await axios.get(`${iminApiBase}`, {
      headers: {
        'X-API-KEY': `${iminApiKey}`,
      },
      params,
    });

    this.totalItems = data['imin:totalItems'];

    if (this.totalItems > 0) {
      this.liveActivities.set('Live Activities', this.transformLiveActivities(data));
    }
  };

  transformLiveActivities = (data: any) =>
    data['imin:item'].map((activity: any) => {
      return {
        contact_name: activity.organizer.name ? activity.organizer.name : null,
        contact_phone: activity.organizer.telephone ? activity.organizer.telephone : null,
        description: activity.description ? activity.description : null,
        gallery_items: activity.image ? activity.image : null,
        has_logo: activity.image ? true : false,
        logo_url: activity.image ? activity.image[0].url : null,
        id: activity.identifier ? activity.identifier : null,
        intro: activity.description ? this.truncateString(activity.description, 150) : null,
        is_free: activity.isAccessibleForFree ? activity.isAccessibleForFree : null,
        name: activity.name ? activity.name : null,
        open_active: true,
        organisation_id: activity.organizer ? activity.organizer.id : null,
        organisation: activity.organizer ? activity.organizer.name : null,
        service_locations: [],
        slug: activity.identifier ? activity.identifier : null,
        type: 'activity',
        video_embed: activity['beta:video'] ? activity['beta:video'][0].url : null,
      };
    });

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

  @action
  radiusChange = (radius: number) => {
    this.radius = radius;
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

    if (this.isLiveActivity) {
      url = this.updateQueryStringParameter('live_activity', this.isLiveActivity, url);
    }

    if (!this.isLiveActivity) {
      url = this.removeQueryStringParameter('live_activity', url);
    }

    if(this.isLiveActivity) {
      if (this.radius) {
        url = this.updateQueryStringParameter('radius', this.radius, url);
      }

      if (!this.radius) {
        url = this.removeQueryStringParameter('radius', url);
      }

      if (this.activityType) {
        url = this.updateQueryStringParameter('activity_type', this.activityType, url);
      }

      if (!this.activityType) {
        url = this.removeQueryStringParameter('activity_type', url);
      }

      if (this.sortBy) {
        url = this.updateQueryStringParameter('sort_by', this.sortBy, url);
      }

      if (!this.sortBy) {
        url = this.removeQueryStringParameter('sort_by', url);
      }

      if (this.isVirtual) {
        url = this.updateQueryStringParameter('is_virtual', this.isVirtual, url);
      }

      if (!this.isVirtual) {
        url = this.removeQueryStringParameter('is_virtual', url);
      }
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
  toggleIsFree = () => {
    this.is_free = !this.is_free;
  };

  @action
  setIsLiveActivity = (setting: boolean) => {
    this.isLiveActivity = setting;
  };

  @action setActivityType = (activity: string) => {
    this.activityType = activity;
  };

  @action setSortBy = (setting: string) => {
    this.sortBy = setting;
  };

  @action
  toggleIsVirtual = () => {
    this.isVirtual = !this.isVirtual;
  };

  @action
  paginate = (page: number) => {
    this.currentPage = page;
    this.results = new Map();
    this.nationalResults = new Map();
    this.loading = true;
  };

  @action
  truncateString = (str: string, num: number) => {
    if (str.length <= num) {
      return str
    }

    return str.slice(0, num) + '...'
  };
}
