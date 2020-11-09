import React, { Fragment } from 'react';
import { observer, inject } from 'mobx-react';
import { withRouter, RouteComponentProps } from 'react-router';
import get from 'lodash/get';
import queryString from 'query-string';

import SearchStore from '../../stores/searchStore';

import './SearchWidget.scss';
import SearchInput from '../../components/SearchInput/SearchInput';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ResultsStore from '../../stores/resultsStore';
import CMSStore from '../../stores/CMSStore';

interface IProps extends RouteComponentProps {
  cmsStore?: CMSStore;
  resultsStore: ResultsStore;
}

interface IState {
  collection_categories: any;
  collection_personas: any;
}

@inject('cmsStore', 'resultsStore')
@observer
class Search extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      collection_categories: [],
      collection_personas: []
    };
  }

  componentDidMount() {
    this.getCollection();
  }

  componentWillUnmount() {
    SearchStore.clear();
  }

  getCollection() {
    const { collection_categories, collection_personas } = queryString.parse(this.props.location.search, {arrayFormat: 'comma'});

    this.setState({
      collection_categories: collection_categories ? [collection_categories] : [],
      collection_personas: collection_personas ? [collection_personas] : [],
    });
  }

  render() {
    const { cmsStore, resultsStore } = this.props;

    // injected stores must be typed as optional, but will always be there if injected. Allows workound for destructuring values from store
    if (!cmsStore || !resultsStore) {
      return null;
    }
    
    const renderSearchInfo = () =>{
      if(this.state.collection_categories.length > 0){
        return <span>This search is restricted to the <strong>{this.state.collection_categories.map((item:string, i:number) => item + (this.state.collection_categories.length !== i + 1 ? ', ' : ' '))} </strong>categorie(s).</span>;
      } else if(this.state.collection_personas.length > 0) {
        return <span>This search is restricted to the <strong>{this.state.collection_personas.map((item:string, i:number) => item + (this.state.collection_personas.length !== i + 1 ? ', ' : ' '))}  </strong>persona(s).</span>;
      }
    }

    return (
      <Fragment>
        <section className="search-widget">
          <form className="flex-container flex-container--mobile-no-padding">
            <div className="flex-col--12">
              <h1 className="search-widget__heading">{get(cmsStore, 'home.search_title')}</h1>
              {(this.state.collection_categories.length > 0 || this.state.collection_personas.length > 0) &&
                <p className="search-widget__info"><FontAwesomeIcon icon="info-circle" />
                  {renderSearchInfo()}
                </p>
              }
            </div>
            <SearchInput showButtonText={true} showGeoLocate={false} keywordFieldLabel="Enter a keyword" postcodeFieldLabel="Enter a location" />
          </form>
        </section>
      </Fragment>
    );
  }
}

export default withRouter(Search);
