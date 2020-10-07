import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { RouteComponentProps } from 'react-router';

import './Category.scss';
import CollectionsStore from '../../../stores/collectionsStore';

import MetaData from '../../../components/MetaData/MetaData';
import Breadcrumb from '../../../components/Breadcrumb/Breadcrumb';
import SearchResultCard from '../../../components/SearchResultCard/SearchResultCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface RouteParams {
  category: string;
}

interface IProps extends RouteComponentProps<RouteParams> {
  collectionsStore: CollectionsStore;
}

class Collection extends Component<IProps> {
  componentDidMount() {
    const { collectionsStore, match } = this.props;

    collectionsStore.getCollection(match.params.category);
  }

  componentDidUpdate(prevProps: IProps) {
    if (prevProps.location.pathname !== this.props.location.pathname) {
      const { collectionsStore, match } = this.props;

      collectionsStore.getCollection(match.params.category);
    }
  }

  render() {
    const { collectionsStore } = this.props;
    const { collection, results } = collectionsStore;
    
    if (!collection) {
      return null;
    }

    console.log(results);

    return(
      <main>
        <MetaData
          title={`${collection.name}`}
          metaDescription={`${collection.intro}`}
        />
        <Breadcrumb crumbs={[{ text: 'Home', url: '/' }, { text: collection.name, url: '' }]} />
        <div className="collection__search-box">
          <div className="flex-container flex-container--justify">
            <div className="flex-col--tablet--12 flex-col--10">
              <div className="flex-container">
                <div className="flex-col">
                  <h1 className="collection__heading"><FontAwesomeIcon icon={collection.icon} /> {collection.name}</h1>
                  <p className="collection__intro">{collection.intro}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="collection__list">
          <div className="flex-container flex-container--justify">
            {collection.size > 0 ? (
              <div className="flex-col--tablet--12 flex-col--10">
                <div className="flex-container">
                  {[...results.entries()].map((result: any) => {
                    return <SearchResultCard key={result.id} result={result} organisation={null} />;
                  })}
                </div>
              </div>
            ) : (
              <div className="flex-col--tablet--12 flex-col--10">
                <div className="flex-container">
                  <div className="flex-col">
                    <h3>There are no results for this collection</h3>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    )

  }
}

export default inject('collectionsStore')(observer(Collection));