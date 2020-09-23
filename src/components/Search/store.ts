import { observable, action } from 'mobx';
import axios from 'axios';
import get from 'lodash/get';

import { apiBase } from '../../config/api';
import {
  ICategory,
  IPersona
} from '../../types/types';

class SearchStore {
  @observable search: string = '';
  @observable location: string = '';
  @observable categories: ICategory[] = [];
  @observable personas: IPersona[] = [];
  @observable categoryId: string = '';
  @observable locationCoords: any;

  constructor() {
    this.getCategories();
    this.getPersonas();
  }

  @action clear = () => {
    this.search = '';
    this.location = '';
    this.categoryId = '';
    this.locationCoords = {};
  };

  @action setCategory = (e: React.ChangeEvent<HTMLSelectElement>) => {
    this.categoryId = e.target.value;
  };

  @action getLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      this.locationCoords = {
        lon: position.coords.longitude.toString(),
        lat: position.coords.latitude.toString(),
      };

      this.geolocate();
    });
  };

  @action geolocate = async () => {
    try {
      const geolocation = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${this.locationCoords.lat},${this.locationCoords.lon}&result_type=postal_code&key=${process.env.REACT_APP_GOOGLE_API_KEY}`
      );

      this.location = get(geolocation, 'data.results[0].formatted_address', {});
    } catch (e) {
      alert('Sorry. We are currently unable to determine your location.');
    }
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

  @action onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.search = e.target.value;
  };
}

export default new SearchStore();
