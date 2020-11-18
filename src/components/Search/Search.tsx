import React, { Fragment } from 'react';
import { observer, inject } from 'mobx-react';
import { withRouter, RouteComponentProps } from 'react-router';
import get from 'lodash/get';

import SearchStore from '../../stores/searchStore';

import './Search.scss';
import CategoryList from '../CategoryList';
import SearchInput from '../SearchInput';
import WindowSizeStore from '../../stores/windowSizeStore';
import CMSStore from '../../stores/CMSStore';
import ResultsStore from '../../stores/resultsStore';

interface IProps extends RouteComponentProps {
  resultsStore?: ResultsStore;
  windowSizeStore?: WindowSizeStore;
  cmsStore?: CMSStore;
}

@inject('resultsStore', 'windowSizeStore', 'cmsStore')
@observer
class Search extends React.Component<IProps> {
  componentDidMount() {
    const { resultsStore } = this.props;
    resultsStore!.clear();
  }

  render() {
    const { windowSizeStore, cmsStore } = this.props;

    // injected stores must be typed as optional, but will always be there if injected. Allows workound for destructuring values from store
    if (!windowSizeStore || !cmsStore) {
      return null;
    }

    return (
      <Fragment>
        <section className="flex-container flex-container--justify search__container">
          <form className="flex-col--tablet--12 flex-col--10 search__inner-container">
            <div className="flex-container flex-container--mobile-no-padding">
              <div className="flex-col--12">
                <h1 className="search__heading">{get(cmsStore, 'home.search_title')}</h1>
              </div>
              <SearchInput showButtonText={true} showGeoLocate={true} keywordFieldLabel="Enter a keyword" postcodeFieldLabel="Enter a location" />
              <div className="flex-col--12">
                <label className="search__support__heading" htmlFor="category">
                  {get(cmsStore, 'home.categories_title')}
                </label>
                <div className="search__category-list">
                  <CategoryList categories={SearchStore.categories} />
                </div>
              </div>
            </div>
          </form>
        </section>
      </Fragment>
    );
  }
}

export default withRouter(Search);
