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
import Select from '../../components/Select';
import Checkbox from '../../components/Checkbox';

interface IProps {
  location: Location;
  resultsStore: ResultStore;
  history: History;
}

interface IState {
  sortBy: string;
}

const activityTypeOptions = [
  {
    value: 'activity-1',
    text: 'Activity 1'
  }
]

const activitySortOptions = [
  {
    value: 'upcoming-sessions',
    text: 'Upcoming Sessions'
  },
  {
    value: 'discovery-geo',
    text: 'Nearest'
  },
  {
    value: 'discovery-price-asc',
    text: 'Price low to high'
  },
  {
    value: 'discovery-price-desc',
    text: 'Price high to low'
  }
]

class Results extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      sortBy: 'upcoming-sessions',
    };
  }

  componentDidMount() {
    const { resultsStore } = this.props;

    resultsStore.getSearchTerms();

    this.setState({
      sortBy: resultsStore.sortBy,
    });
  }

  componentDidUpdate(prevProps: IProps) {
    if (prevProps.location.search !== this.props.location.search) {
      const { resultsStore } = this.props;
      resultsStore.clear();
      resultsStore.getSearchTerms();
    }
  }

  handleInputChange = (string: string, field: string) => {
    // @ts-ignore
    this.setState({
      [field]: string,
    });
  };

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
              <div className="flex-col results__filters__col">
                {!!resultsStore.results.size && !resultsStore.loading && (	
                  <p>{resultsStore.totalItems > 25 ? 'Over 25' : resultsStore.totalItems} service(s) found</p>	
                )}	
              </div>	
              <div className="flex-col results__filters__col">
              {resultsStore.isLiveActivity ? (
                <div className="flex-container flex-container--no-padding flex-container--no-space flex-container--align-bottom results__filters">
                  <div className="flex-col flex-col--tablet--6 flex-col--standard--4 results__filters__col">
                    <label htmlFor="activity_type" className="results__filters__heading">Activity Type <small>e.g. Yoga</small></label>
                    <Select
                      className="results__filters__select"
                      options={activityTypeOptions}
                      id="activity_type"
                      placeholder="Select an activity type"
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => { }}
                    />
                  </div>
                  <div className="flex-col flex-col--tablet--6 flex-col--standard--4 results__filters__col">
                    <label htmlFor="activity_type" className="results__filters__heading">Sort by</label>
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
                          search: resultsStore!.amendSearch()
                        });
                      }}
                    />
                  </div>
                  <div className="flex-col flex-col--tablet--6 flex-col--standard--3 results__filters__col">
                    <Checkbox	
                      id="virtual_activities"	
                      label="<strong>Virtual</strong><br>Activities"
                      checked={false}	
                      onChange={() => {	
                        
                      }}	
                      className="results__filters__checkbox"	
                    />
                  </div>
                </div>
              ) : (
                <ViewFilter />
              )}
              </div>
            </div>
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
