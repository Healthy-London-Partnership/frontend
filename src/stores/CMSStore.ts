import axios from 'axios';
import { apiBase } from '../config/api';
import { observable, computed } from 'mobx';
import get from 'lodash/get';
import forEach from 'lodash/forEach';
import omit from 'lodash/omit';
import every from 'lodash/every';

import { IBanner } from '../types/types';

interface IAbout {
  content: string;
  title: string;
  video_url: string;
}

interface IContent {
  title: string;
  content: string;
}

interface IGlobal {
  contact_email: string;
  contact_phone: string;
  facebook_handle: string;
  footer_content: string;
  footer_title: string;
  twitter_handle: string;
}

interface IHome {
  categories_title: string;
  personas_content: string;
  personas_title: string;
  search_title: string;
}

class CMSStore {
  @observable about: IAbout | null = null;
  @observable contact: IContent | null = null;
  @observable favourites: IContent | null = null;
  @observable providers: IContent | null = null;
  @observable supporters: IContent | null = null;
  @observable funders: IContent | null = null;
  @observable privacy_policy: IContent | null = null;
  @observable terms_and_conditions: IContent | null = null;
  @observable global: IGlobal | null = null;
  @observable home: IHome | null = null;
  @observable banner: IBanner | null = null;

  constructor() {
    this.getCMSFields();
  }

  getCMSFields = async () => {
    try {
      const CMSFields = await axios.get(`${apiBase}/settings`);
      const cmsData = get(CMSFields, 'data.data.cms.frontend');

      return forEach(cmsData, (data, key) => {
        // @ts-ignore
        this[key] = data;
      });
    } catch (e) {
      console.error(e);
    }
  };

  @computed
  get hasBanner() {
    const bannerFields = omit(this.banner, 'has_image');

    return every(bannerFields, field => field === null) ? false : true;
  }

  @computed
  get hasVideo() {
    return get(this.about, 'video_url') !== 'Video URL';
  }

  @computed
  get hasContactInfo() {
    if (this.global) {
      return !(
        this.global.contact_email === 'Contact email' &&
        this.global.contact_phone === 'Contact phone' &&
        this.global.facebook_handle === 'Facebook handle' &&
        this.global.twitter_handle === 'Twitter handle'
      );
    }
    return false;
  }
}

export default CMSStore;
