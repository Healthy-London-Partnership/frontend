import React, { Fragment } from 'react';
import Search from '../../components/Search';

import './Home.scss';

const Home: React.FunctionComponent = () => {
  return (
    <Fragment>
      <Search />
      <section className="home-about">
        <div className="flex-container flex-container--justify">
          <div className="flex-col flex-col--10">
            <div className="home-about-wrapper">
              <h2 className="home-about-title">About Connect</h2>
              <p>Text that sells the platform! Lorem ipsum dolor sit amet, consectetur adipiscing elit. Bibendum non libero, aliquet a. Sit vestibulum nibh adipiscing odio sed. Ut turpis sodales non elit dictum commodo, morbi tempus. Volutpat phasellus tellus suscipit aliquam. Pretium non laoreet arcu risus, molestie sed risus, tellus.</p>
            </div>
          </div>
        </div>
      </section>
    </Fragment>
  )
};

export default Home;
