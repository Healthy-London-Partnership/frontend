import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { History } from 'history';
import get from 'lodash/get';

import './Results.scss';
import ResultStore from '../../stores/resultsStore';
import Category from './Filters/Category';
import Keyword from './Filters/Keyword';
import ListView from './ListView';

import Breadcrumb from '../../components/Breadcrumb';
import map from 'lodash/map';
import SideboxCard from './SideboxCard';
import { ISidebox } from '../../types/types';
import Layout from '../../components/Layout';

interface IProps {
  location: Location;
  resultsStore: ResultStore;
  history: History;
}

class Results extends Component<IProps> {
  componentDidMount() {
    const { resultsStore } = this.props;

    resultsStore.getSearchTerms();
  }

  hasCategories = () => {
    const { resultsStore } = this.props;

    if (resultsStore.categories) {
      return get(resultsStore, 'category.sideboxes', []);
    }

    if (resultsStore.persona) {
      return get(resultsStore, 'persona.sideboxes', []);
    }

    return null;
  };

  componentDidUpdate(prevProps: IProps) {
    if (prevProps.location.search !== this.props.location.search) {
      const { resultsStore } = this.props;
      resultsStore.getSearchTerms();
    }
  }

  componentWillUnmount() {
    const { resultsStore } = this.props;

    resultsStore.clear();
  }

  render() {
    const { resultsStore, history } = this.props;
    return (
      <Layout>
        <section>
          <Breadcrumb crumbs={[{ text: 'Home', url: '/' }, { text: 'Search', url: '' }]} />
          <div className="results__search-box">
            {resultsStore.isKeywordSearch ? <Keyword /> : <Category />}
          </div>

          <div className="results__list">
            {this.hasCategories() && (
              <div className="flex-container flex-container--mobile-no-padding results__category-sidebar">
                {map(this.hasCategories(), (sidebox: ISidebox) => {
                  return <SideboxCard sidebox={sidebox} />;
                })}
              </div>
            )}

            <ListView resultsStore={resultsStore} history={history} />
          </div>
        </section>
      </Layout>
    );
  }
}

export default inject('resultsStore')(observer(Results));
