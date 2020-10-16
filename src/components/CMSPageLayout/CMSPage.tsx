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
      <div className="cms__header__inner flex-col--10">
        <Breadcrumb crumbs={[{ text: 'Home', url: '/' }, { text: breadcrumb, url: '' }]} />
        <div className="cms__title-card">
          <h1 className="cms__title-card--title">{title}</h1>
        </div>
      </div>
    </div>
    <main className="flex-container flex-container--justify">
      {twoColumn ? (
        children
      ) : (
        <div className="flex-col flex-col--10 flex-col--tablet--12 cms__content">{children}</div>
      )}
    </main>
  </section>
);

export default CMSPage;
