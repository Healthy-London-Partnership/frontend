import React, { Component, Fragment } from 'react';
import { observer, inject } from 'mobx-react';
import { RouteComponentProps } from 'react-router';

import './Collection.scss';
import CollectionsStore from '../../../stores/collectionsStore';

import MetaData from '../../../components/MetaData/MetaData';
import Breadcrumb from '../../../components/Breadcrumb/Breadcrumb';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface RouteParams {
  collection: string;
}

interface IProps extends RouteComponentProps<RouteParams> {
  collectionsStore: CollectionsStore;
}

class Collection extends Component<IProps> {
  componentDidMount() {
    const { collectionsStore, match } = this.props;

    collectionsStore.getCollection(match.params.collection);
  }

  componentDidUpdate(prevProps: IProps) {
    if (prevProps.location.pathname !== this.props.location.pathname) {
      const { collectionsStore, match } = this.props;

      collectionsStore.getCollection(match.params.collection);
    }
  }

  render() {
    const { collectionsStore } = this.props;
    const { collection } = collectionsStore;
    
    if (!collection) {
      return null;
    }

    console.log(collection);

    return(
      <section>
        <MetaData
          title={`${collection.name}`}
          metaDescription={`${collection.intro}`}
        />
        <Breadcrumb crumbs={[{ text: 'Home', url: '/' }, { text: 'Collection', url: '' }]} />
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

        <div className="collection__list"></div>
      </section>
    )

  }
}

export default inject('collectionsStore')(observer(Collection));