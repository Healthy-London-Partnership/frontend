import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { History } from 'history';

import './Results.scss';
import ResultStore from '../../stores/resultsStore';
import Category from './Filters/Category';
import Keyword from './Filters/Keyword';
import ListView from './ListView';

import Breadcrumb from '../../components/Breadcrumb';

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

  componentDidUpdate(prevProps: IProps) {
    if (prevProps.location.search !== this.props.location.search) {
      const { resultsStore } = this.props;
      resultsStore.clear();
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
      <section>
        <Breadcrumb crumbs={[{ text: 'Home', url: '/' }, { text: 'Search', url: '' }]} />
        <div className="results__search-box">
          {resultsStore.isKeywordSearch ? <Keyword /> : <Category />}
        </div>

        <div className="results__list">
          <ListView resultsStore={resultsStore} history={history} />
        </div>
      </section>
    );
  }
}

export default inject('resultsStore')(observer(Results));
