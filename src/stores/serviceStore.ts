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
    console.log(this.service);

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

    const activity = data;
    let today = new Date();

    console.log(activity);

    this.service = {
      contact_email: activity.organizer.email ? activity.organizer.email : null,
      contact_name: activity.organizer.name ? activity.organizer.name : null,
      contact_phone: activity.organizer.telephone ? activity.organizer.telephone : null,
      criteria: {
        age_group: (activity.ageRange.minValue ? activity.ageRange.minValue + ' - ' : '') + (activity.ageRange.maxValue ? activity.ageRange.maxValue : ''),
        disability: '',
        employment: '',
        gender: activity.genderRestriction ? activity.genderRestriction.replace(/([a-z])([A-Z])/g, '$1 $2').replace('oa:', '') : null,
        housing: '',
        income: '',
        language: '',
        other: '',
      },
      created_at: today.toISOString(),
      description: activity.description ? activity.description : null,
      fees_text: null,
      fees_url: null,
      gallery_items: activity.image ? activity.image : null,
      has_logo: activity.image ? true : false,
      id: activity.identifier ? activity.identifier : null,
      intro: activity.description ? this.truncateString(activity.description, 150) : '',
      is_free: activity.isAccessibleForFree ? activity.isAccessibleForFree : null,
      is_national: false,
      last_modified_at: today.toISOString(),
      logo_url: activity.image ? activity.image[0].url : null,
      name: activity.name ? activity.name : null,
      offerings: [],
      open_active: true,
      organisation_id: activity.organizer ? activity.organizer.id : null,
      organisation: activity.organizer ? activity.organizer : null,
      referral_button_text: null,
      referral_email: null,
      referral_method: 'none',
      referral_url: null,
      service_locations: [],
      show_referral_disclaimer: false,
      slug: activity.identifier ? activity.identifier : null,
      social_medias: [],
      status: '',
      testimonial: null,
      type: 'activity',
      updated_at: today.toISOString(),
      url: '',
      useful_infos: [],
      video_embed: activity['beta:video'] ? activity['beta:video'][0].url : null,
      wait_time: null,
    };

    this.locations = [
      {
        created_at: '',
        has_image: false,
        holiday_opening_hours: [],
        id: activity['imin:locationSummary'][1] ? activity['imin:locationSummary'][1].id : activity['imin:locationSummary'][0].id,
        is_open_now: false,
        location: {
          accessibility_info: null,
          address_line_1: activity['imin:locationSummary'][1] ? activity['imin:locationSummary'][1].address.streetAddress : activity['imin:locationSummary'][0].address.streetAddress,
          address_line_2: activity['imin:locationSummary'][1] ? activity['imin:locationSummary'][1].address.addressLocality : activity['imin:locationSummary'][0].address.addressLocality,
          address_line_3: activity['imin:locationSummary'][1] ? activity['imin:locationSummary'][1].address.addressRegion :  activity['imin:locationSummary'][0].address.addressRegion,
          city: activity['imin:locationSummary'][1] ? activity['imin:locationSummary'][1].address.addressLocality : activity['imin:locationSummary'][0].address.addressLocality,
          country: activity['imin:locationSummary'][1] ? activity['imin:locationSummary'][1].address.addressCountry : activity['imin:locationSummary'][0].address.addressCountry,
          county: activity['imin:locationSummary'][1] ? activity['imin:locationSummary'][1].address.addressRegion :  activity['imin:locationSummary'][0].address.addressRegion,
          created_at: '',
          has_image: false,
          has_induction_loop: false,
          has_wheelchair_access: false,
          id: activity['imin:locationSummary'][1] ? activity['imin:locationSummary'][1].id : activity['imin:locationSummary'][0].id,
          lat: activity['imin:locationSummary'][1] ? activity['imin:locationSummary'][1].geo.latitude : activity['imin:locationSummary'][0].geo.latitude,
          lon: activity['imin:locationSummary'][1] ? activity['imin:locationSummary'][1].geo.longitude : activity['imin:locationSummary'][0].geo.longitude,
          postcode: activity['imin:locationSummary'][1] ? activity['imin:locationSummary'][1].address.postalCode : activity['imin:locationSummary'][0].address.postalCode,
          updated_at: '',
        },
        location_id: activity['imin:locationSummary'][1] ? activity['imin:locationSummary'][1].id : activity['imin:locationSummary'][0].id,
        name: activity['imin:locationSummary'][1] ? activity['imin:locationSummary'][1].name : activity['imin:locationSummary'][0].name,
        regular_opening_hours: [],
        service_id: activity.identifier ? activity.identifier : null,
        updated_at: '',
      }
    ]
  };

  @action
  getServiceLocations = async () => {
    if (this.service) {
      if(!this.service.open_active) {
        const locationData = await axios.get(
          `${apiBase}/service-locations?filter[service_id]=${this.service.id}&include=location`
        );
  
        this.locations = get(locationData, 'data.data');
      }
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
