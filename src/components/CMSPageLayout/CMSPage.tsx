import React from 'react';

import './CMSPage.scss';
import Breadcrumb from '../Breadcrumb';

interface IProps {
  title: string;
  children: any;
  twoColumn?: boolean;
  breadcrumb: string;
}

const CMSPage: React.FunctionComponent<IProps> = ({ title, children, twoColumn, breadcrumb }) => (
  <section className="cms">
    <div className="cms__header flex-container flex-container--justify">
      <div className="cms__header__inner flex-col--10 flex-col--tablet-large--12">
        <Breadcrumb crumbs={[{ text: 'Home', url: '/' }, { text: breadcrumb, url: '' }]} />
        <div className="cms__title-card">
          <h1 className="cms__title-card--title">{title}</h1>
        </div>
      </div>
    </div>
    <div className="cms__content flex-container flex-container--justify">
      <div className="cms__content__inner flex-col--10">
        {children}
      </div>
    </div>
  </section>
);

export default CMSPage;
