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
              <p>NHS Connect is a new service, pioneered by the NHS and leading Councils, that gives you the ability to find the health and wellbeing support that meets your needs.</p>
              <p>Connect is currently available in a small group of pilot London boroughs: Camden, Merton, Hillingdon, Kensington and Chelsea, Southwark and Westminster. We’ll be adding many more local areas at the end of 2020; prior to that we’ll continue to make lots of improvements to the system as a whole.</p>
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
