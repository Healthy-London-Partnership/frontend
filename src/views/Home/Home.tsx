import React, { Fragment } from 'react';
import Search from '../../components/Search';

import './Home.scss';

import Link from '../../components/Link/Link';

const Home: React.FunctionComponent = () => {
  return (
    <Fragment>
      <Search />
      <section className="home-about">
        <div className="flex-container flex-container--justify">
          <div className="flex-col flex-col--10">
            <div className="home-about-wrapper">
              <h2 className="home-about-title">About Connect</h2>
              <p>We're here to connect you with the health, care and wellbeing support that best meets your needs. We're in the process of adding new support opportunities, so if you can't find what you are looking for this time, please come back soon for another look.</p>
              <Link
                text="Read more"
                href="/about-connect"
                size="medium"
                icon="arrow-circle-right"
                iconPosition="right"
              />
            </div>
          </div>
        </div>
      </section>
    </Fragment>
  )
};

export default Home;
