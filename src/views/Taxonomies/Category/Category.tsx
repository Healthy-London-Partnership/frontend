import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { RouteComponentProps } from 'react-router';

import './Category.scss';
import ResultsStore from '../../../stores/resultsStore';

import MetaData from '../../../components/MetaData/MetaData';
import Breadcrumb from '../../../components/Breadcrumb/Breadcrumb';
import Link from '../../../components/Link/Link';
import Loading from '../../../components/Loading/Loading';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface RouteParams {
  category: string;
}

interface IProps extends RouteComponentProps<RouteParams> {
  resultsStore: ResultsStore;
}

class Category extends Component<IProps> {
  componentDidMount() {
    const { resultsStore, match } = this.props;
    
    resultsStore.getTaxonomiesCategory(match.params.category);
  }

  componentDidUpdate(prevProps: IProps) {
    if (prevProps.location.pathname !== this.props.location.pathname) {
      const { resultsStore, match } = this.props;

      resultsStore.clear();
      resultsStore.getTaxonomiesCategory(match.params.category);
    }
  }

  componentWillUnmount() {
    const { resultsStore } = this.props;

    resultsStore.clear();
  }

  render() {
    const { resultsStore } = this.props;
    const { taxonomyCategory } = resultsStore;
    
    if (!taxonomyCategory) {
      return <Loading />;
    }

    return(
      <main>
        <MetaData
          title={`${taxonomyCategory.name}`}
        />
        <Breadcrumb crumbs={[{ text: 'Home', url: '/' }, { text: taxonomyCategory.name, url: '' }]} />
        <div className="taxonomy__search-box">
          <div className="flex-container flex-container--justify">
            <div className="flex-col--tablet--12 flex-col--10">
              <div className="flex-container">
                <div className="flex-col flex-col--8 flex-col--standard--12">
                  <h1 className="taxonomy__heading"><FontAwesomeIcon icon={taxonomyCategory.icon} /> {taxonomyCategory.name}</h1>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="taxonomy__list">
          <div className="flex-container flex-container--justify">
            {taxonomyCategory.children.length > 0 ? (
              <div className="flex-col--tablet--12 flex-col--10 taxonomy__list">
                <div className="flex-container">
                  <div className="flex-col flex-col--8 flex-col--standard--12">
                    <ul>
                      {taxonomyCategory.children.map((item: any, i: number) => {
                        return (
                          <li key={i}>
                            <Link
                              size={'medium'}
                              text={item.name}
                              href={'/taxonomies/categories/' + item.slug}
                              />
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-col--tablet--12 flex-col--10">
                <div className="flex-container">
                  <div className="flex-col">
                    <h3>There are no results for this category</h3>
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

export default inject('resultsStore')(observer(Category));