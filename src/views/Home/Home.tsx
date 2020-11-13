import React, { Fragment } from 'react';
import { observer, inject } from 'mobx-react';
import { RouteComponentProps } from 'react-router';
import get from 'lodash/get';

import CMSStore from '../../stores/CMSStore';
import SearchStore from '../../stores/searchStore';

import './Home.scss';
import WhyConnectImg from '../../assets/images/why-connect.svg';

import Search from '../../components/Search';
import CategoryList from '../../components/CategoryList';
import Link from '../../components/Link/Link';

interface IProps extends RouteComponentProps {
  cmsStore: CMSStore;
}

@inject('cmsStore')
@observer
class Home extends React.Component<IProps> {
  render() {
    const { cmsStore } = this.props;

    // injected stores must be typed as optional, but will always be there if injected. Allows workound for destructuring values from store
    if (!cmsStore) {
      return null;
    }

    return (
      <Fragment>
        <Search />
        <section className="home">
          <div className="home-collections">
            <div className="flex-container flex-container--justify">
              <div className="flex-col flex-col--10">
                <div className="home-wrapper">
                  <h2 className="home-title">
                    {get(cmsStore, 'home.categories_title')}
                  </h2>
                  <CategoryList categories={SearchStore.categories} />
                </div>
              </div>
            </div>
          </div>
          <div className="home-about">
            <div className="flex-container flex-container--justify">
              <div className="flex-col flex-col--10">
                <div className="home-wrapper">
                  <div className="flex-container flex-container--no-padding flex-container--no-space flex-container--wrap">
                    <div className="flex-col flex-col--6 flex-col--standard--12 home-about__content">
                      <h2 className="home-title">About Connect</h2>
                      <p>We're here to connect you with the health, care and wellbeing support that best meets your needs. We're in the process of adding new support opportunities, so if you can't find what you are looking for this time, please come back soon for another look.</p>
                      <Link
                        text="Read more"
                        href="/about-connect"
                        size="medium"
                        icon="arrow-circle-right"
                        iconPosition="right"
                      />
                    </div>
                    <div className="flex-col">
                      <img src={WhyConnectImg} alt="Why Connect" className="home-about__image" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Fragment>
    )
  }
};

export default Home;