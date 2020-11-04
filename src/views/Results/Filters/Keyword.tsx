import React, { Component, Fragment } from 'react';
import { inject, observer } from 'mobx-react';
import get from 'lodash/get';

import { withRouter, RouteComponentProps } from 'react-router';
import queryString from 'query-string';

import ResultsStore from '../../../stores/resultsStore';
import WindowSizeStore from '../../../stores/windowSizeStore';
import UIStore from '../../../stores/uiStore';
import SearchInput from '../../../components/SearchInput';
import Checkbox from '../../../components/Checkbox';
import Select from '../../../components/Select';

interface IProps extends RouteComponentProps {
  resultsStore?: ResultsStore;
  windowSizeStore?: WindowSizeStore;
  uiStore?: UIStore;
}

interface IState {
  keyword: string;
  postcode: string;
  errors: any;
}

const activityTypeOptions = [
  {
    value: 'activity-1',
    text: 'Activity 1'
  }
]

const activitySortOptions = [
  {
    value: 'nearest',
    text: 'Nearest'
  }
]

@inject('resultsStore', 'windowSizeStore', 'uiStore')
@observer
class Keyword extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      keyword: '',
      postcode: '',
      errors: {
        keyword: false,
      },
    };
  }

  componentDidMount() {
    const { search_term, location } = queryString.parse(this.props.location.search);

    if (search_term) {
      this.setState({
        keyword: search_term as string,
      });
    }

    if (location) {
      this.setState({
        postcode: location as string,
      });
    }
  }

  handleInputChange = (string: string, field: string) => {
    // @ts-ignore
    this.setState({
      [field]: string,
    });
  };

  render() {
    const { resultsStore, windowSizeStore, uiStore } = this.props;

    if (!resultsStore || !windowSizeStore || !uiStore) {
      return null;
    }
    return (
      <form>
        <div className="flex-container flex-container--no-padding">
          <div className="flex-col">
            <h1 className="results__heading">{resultsStore.isLiveActivity ? 'Physical Activities in your area' : 'Results found for'}</h1>
          </div>
        </div>
        <div className="flex-container flex-container--no-padding flex-container--align-center">
          <div className="flex-col" style={{flexGrow: 1}}>
            <div className="flex-container flex-container--no-padding">
              <SearchInput showButtonText={false} keywordFieldLabel="Keyword" postcodeFieldLabel="Location" />
            </div>
          </div>
          <div className="flex-col--2 flex-col--tablet--12">
            {!resultsStore.isLiveActivity ? (
              <Checkbox	
                id="is_free"	
                label="<strong>Cost</strong><br>Free"
                checked={get(resultsStore, 'is_free', false)}	
                onChange={() => {	
                  resultsStore!.toggleIsFree();
                  this.props.history.push({
                    pathname: '/results',
                    search: resultsStore!.amendSearch()
                  });
                }}	
                className="results__keyword-edit-checkbox"	
              />
            ) : (
              <Checkbox	
                id="virtual_activities"	
                label="<strong>Virtual</strong><br>Activities"
                checked={false}	
                onChange={() => {	
                  
                }}	
                className="results__filters__checkbox"	
              />
            )}
          </div>
        </div>
        {resultsStore.isLiveActivity &&
          <Fragment>
            <div className="flex-container flex-container--no-padding flex-container--no-space results__filters">
              <div className="flex-col flex-col--tablet--6 flex-col--standard--3 results__filters__col">
                <label htmlFor="activity_type" className="results__filters__heading">Activity Type</label>
                <Select
                  className="results__filters__select"
                  options={activityTypeOptions}
                  id="activity_type"
                  placeholder="Select an activity type"
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => { }}
                />
              </div>
              <div className="flex-col flex-col--tablet--6 flex-col--standard--3 results__filters__col">
                <label htmlFor="activity_type" className="results__filters__heading">Sort by</label>
                <Select
                  className="results__filters__select"
                  options={activitySortOptions}
                  id="sort_by"
                  placeholder="Select sorting method"
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => { }}
                />
              </div>
            </div>
          </Fragment>
        }
      </form>
    );
  }
}

export default withRouter(Keyword);
