import { observable, action, computed } from 'mobx';
import axios from 'axios';
import { apiBase, iminApiKey, iminApiBase } from '../config/api';
import get from 'lodash/get';
import every from 'lodash/every';
import { IService, IServiceLocation } from '../types/types';

export default class ServiceStore {
  @observable service: IService | null = null;
  @observable locations: IServiceLocation[] = [];
  @observable loading: boolean = false;
  @observable relatedServices: IService[] | null = null;
  @observable favourite: boolean = false;

  checkIfFavorited = () => {
    const favourites = localStorage.getItem('favourites');

    if (favourites && this.service) {
      const favouriteList = JSON.parse(favourites);

      this.favourite = favouriteList.includes(this.service.id);
    }
  };

  @computed
  get hasCriteria() {
    if (this.service) {
      return every(this.service.criteria, criteria => criteria === null) ? false : true;
    }

    return false;
  }

  @action
  fetchService = async (name: string) => {
    this.loading = true;
    const serviceData = await axios.get(`${apiBase}/services/${name}?include=organisation`);
    this.service = get(serviceData, 'data.data');

    this.getServiceLocations();
    this.getRelatedServices(name);
    this.checkIfFavorited();
  };

  @action
  fetchActivity = async (id: string) => {
    const { data } = await axios.get(`${iminApiBase}/${id}`, {
      headers: {
        'X-API-KEY': `${iminApiKey}`
      }
    });

    console.log(data);

    const activity = data;

    // this.service = {
    //   contact_name: activity.organizer.name ? activity.organizer.name : null,
    //   contact_phone: activity.organizer.telephone ? activity.organizer.telephone : null,
    //   description: activity.description ? activity.description : null,
    //   gallery_items: activity.image ? activity.image : null,
    //   has_logo: activity.image ? true : false,
    //   logo_url: activity.image ? activity.image[0].url : null,
    //   id: activity.identifier ? activity.identifier : null,
    //   intro: activity.description ? this.truncateString(activity.description, 150) : null,
    //   is_free: activity.isAccessibleForFree ? activity.isAccessibleForFree : null,
    //   name: activity.name ? activity.name : null,
    //   open_active: true,
    //   organisation_id: activity.organizer ? activity.organizer.id : null,
    //   organisation: activity.organizer ? activity.organizer.name : null,
    //   service_locations: [],
    //   slug: activity.identifier ? activity.identifier : null,
    //   type: 'activity',
    //   video_embed: activity['beta:video'] ? activity['beta:video'][0].url : null,
    // };

    // console.log(this.service);
  };

  @action
  getServiceLocations = async () => {
    if (this.service) {
      const locationData = await axios.get(
        `${apiBase}/service-locations?filter[service_id]=${this.service.id}&include=location`
      );

      this.locations = get(locationData, 'data.data');
    }
  };

  @action
  getRelatedServices = async (name: string) => {
    const relatedServicesData = await axios.get(`${apiBase}/services/${name}/related`);

    this.relatedServices = get(relatedServicesData, 'data.data');

    this.loading = false;
  };

  addToFavourites = () => {
    if (this.service) {
      if (localStorage.getItem('favourites')) {
        const favourites = localStorage.getItem('favourites') || '';

        const favouritesArr = JSON.parse(favourites);
        favouritesArr.push(this.service.id);

        localStorage.setItem('favourites', JSON.stringify(favouritesArr));
      } else {
        localStorage.setItem('favourites', JSON.stringify([this.service.id]));
      }
    }

    this.favourite = true;
  };

  @action
  truncateString = (str: string, num: number) => {
    if (str.length <= num) {
      return str
    }

    return str.slice(0, num) + '...'
  };
}
