import React, { Component, Fragment } from 'react';
import { observer, inject } from 'mobx-react';
import { History } from 'history';
import get from 'lodash/get';

import './Results.scss';
import ResultStore from '../../stores/resultsStore';
import Keyword from './Filters/Keyword';
import ViewFilter from './Filters/ViewFilter/ViewFilter';
import ListView from './ListView';
import MapView from './MapView';

import MetaData from '../../components/MetaData';
import Breadcrumb from '../../components/Breadcrumb';
import Cta from '../../components/Cta';
import Select from '../../components/Select';
// import Checkbox from '../../components/Checkbox';
import SelectFilter from './Filters/SelectFilter/SelectFilter';
import ActivityTypeFilter from './Filters/ActivityTypeFilter';
import { activitySortOptions, activityAnyDayOptions, activityAnyTimeOptions } from './meta';

interface IProps {
  location: Location;
  resultsStore: ResultStore;
  history: History;
}

const activitySortOptions = [
  {
    value: 'upcoming-sessions',
    text: 'Upcoming Sessions',
  },
  {
    value: 'discovery-geo',
    text: 'Nearest',
  },
  {
    value: 'discovery-price-asc',
    text: 'Price low to high',
  },
  {
    value: 'discovery-price-desc',
    text: 'Price high to low',
  },
];

class Results extends Component<IProps, any> {
  componentDidMount() {
    const { resultsStore } = this.props;

    resultsStore.getSearchTerms();
    resultsStore.getActivityTypes();
  }

  componentDidUpdate(prevProps: IProps) {
    if (prevProps.location.search !== this.props.location.search) {
      const { resultsStore } = this.props;
      resultsStore.clear();
      resultsStore.getSearchTerms();
      resultsStore.getActivityTypes();
    }
  }

  render() {
    const { resultsStore, history } = this.props;
    return (
      <section>
        <MetaData
          title={`Search Results ${resultsStore.keyword ? 'for ' + resultsStore.keyword : ''}${
            resultsStore.postcode ? ' in ' + resultsStore.postcode : ''
          }`}
          metaDescription={`Search Results ${
            resultsStore.keyword ? 'for ' + resultsStore.keyword : ''
          }${resultsStore.postcode ? ' in ' + resultsStore.postcode : ''}`}
        />
        <div className="results__search-box flex-container flex-container--justify">
          <div className="results__search-box__inner flex-col--10 flex-col--tablet-large--12">
            <Breadcrumb
              crumbs={[
                { text: 'Home', url: '/' },
                { text: 'Search', url: '' },
              ]}
            />
            <Keyword />
          </div>
        </div>

        <div className="results__list flex-container flex-container--justify">
          <div className="results__list__inner flex-col--tablet--12 flex-col--10">
            <div
              className="results__filters flex-container flex-container--no-padding"
              style={{
                alignItems: resultsStore.isLiveActivity ? 'flex-end' : 'center',
                justifyContent: resultsStore.isLiveActivity ? 'flex-start' : 'space-between',
              }}
            >
              <div
                className="flex-col results__filters__col"
                style={{ width: resultsStore.isLiveActivity ? '100%' : 'auto' }}
              >
                {!!resultsStore.results.size && !resultsStore.loading && (
                  // <p>{resultsStore.totalItems > 25 ? 'Over 25' : resultsStore.totalItems} service(s) found</p>
                  <p className="results__filters__col__text">{`${resultsStore.totalItems} (after filtering) results`}</p>
                )}
              </div>

              {resultsStore.isLiveActivity ? (
                <Fragment>
                  <div className="flex-col results__filters__col">
                    <label htmlFor="activity_type" className="results__filters__heading">
                      Activity Type <small>e.g. Running</small>
                    </label>
                    <Select
                      className="results__filters__select"
                      options={resultsStore.activityTypes}
                      id="activity_type"
                      placeholder="Select activity type"
                      selected={resultsStore.activityType}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                        resultsStore!.setActivityType(e.target.value);
                        this.props.history.push({
                          pathname: '/results',
                          search: resultsStore!.amendSearch(),
                        });
                      }}
                    />
                  </div>
                  <div className="flex-col results__filters__col">
                    <label htmlFor="sort_by" className="results__filters__heading">
                      Sort by
                    </label>

                    <Select
                      className="results__filters__select"
                      options={activitySortOptions}
                      id="sort_by"
                      placeholder="Select sorting method"
                      selected={resultsStore.sortBy}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                        resultsStore!.setSortBy(e.target.value);
                        this.props.history.push({
                          pathname: '/results',
                          search: resultsStore!.amendSearch(),
                        });
                      }}
                    />
                  </div>
                  <div className="flex-col results__filters__col">
                    <Checkbox
                      id="virtual_activities"
                      label="<strong>Show virtual activities only</strong><br>e.g. Zoom classes"
                      checked={get(resultsStore, 'isVirtual', false)}
                      onChange={() => {
                        resultsStore!.toggleIsVirtual();
                        this.props.history.push({
                          pathname: '/results',
                          search: resultsStore!.amendSearch(),
                        });
                      }}
                      className="results__filters__checkbox"
                    />
                  </div>
                </Fragment>
              ) : (
                <div className="flex-col results__filters__col">
                  <ViewFilter />
                </div>
              )}
            </div>
            {resultsStore.nhsResult && (
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
            )}
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
