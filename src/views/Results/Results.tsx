import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { History } from 'history';

import './Results.scss';
import ResultStore from '../../stores/resultsStore';
import Keyword from './Filters/Keyword';
import ViewFilter from './Filters/ViewFilter/ViewFilter';
import ListView from './ListView';
import MapView from './MapView';

import MetaData from '../../components/MetaData';
import Breadcrumb from '../../components/Breadcrumb';
import Cta from '../../components/Cta';

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

  render() {
    const { resultsStore, history } = this.props;
    return (
      <section>
        <MetaData
          title={`Search Results ${resultsStore.keyword ? 'for ' + resultsStore.keyword : ''}${resultsStore.postcode ? ' in ' + resultsStore.postcode : ''}`}
          metaDescription={`Search Results ${resultsStore.keyword ? 'for ' + resultsStore.keyword : ''}${resultsStore.postcode ? ' in ' + resultsStore.postcode : ''}`}
        />
        <div className="results__search-box flex-container flex-container--justify">
          <div className="results__search-box__inner flex-col--10 flex-col--tablet-large--12">
            <Breadcrumb crumbs={[{ text: 'Home', url: '/' }, { text: 'Search', url: '' }]} />
            <Keyword />
          </div>
        </div>

        <div className="results__list flex-container flex-container--justify">
          <div className="results__list__inner flex-col--tablet--12 flex-col--10">
            <div className="results__filters flex-container flex-container--no-padding flex-container--align-center flex-container--space">
              <div className="flex-col flex-col--6">
                {!!resultsStore.results.size && !resultsStore.loading && (	
                  <p>{resultsStore.totalItems > 25 ? 'Over 25' : resultsStore.totalItems} service(s) found</p>	
                )}	
              </div>	
              <div className="flex-col flex-col--6">	
                <ViewFilter />
              </div>
            </div>
            {resultsStore.nhsResult &&
              <div className="results__nhs-results">
                <div className="flex-container flex-container--justify flex-container--no-padding">
                  <div className="flex-col flex-col--12">
                    <Cta
                      title={resultsStore.nhsResult.about.name}
                      description={resultsStore.nhsResult.description}
                      buttonUrl={resultsStore.nhsResult.url.replace('api.nhs.uk', 'www.nhs.uk')}
                      />
                  </div>
                </div>
              </div>
            }
            {resultsStore.view === 'grid' ? (	
              <ListView resultsStore={resultsStore} history={history} />	
            ) : (	
              <MapView />
            )}
          </div>
        </div>
      </section>
    );
  }
}

export default inject('resultsStore')(observer(Results));
