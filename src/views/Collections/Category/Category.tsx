import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { RouteComponentProps } from 'react-router';

import './Category.scss';
import ResultsStore from '../../../stores/resultsStore';

import MetaData from '../../../components/MetaData/MetaData';
import Breadcrumb from '../../../components/Breadcrumb/Breadcrumb';
import Cta from '../../../components/Cta/Cta';
import List from '../../../views/Results/ListView/List';
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
    
    resultsStore.getCategory(match.params.category);
  }

  componentDidUpdate(prevProps: IProps) {
    if (prevProps.location.pathname !== this.props.location.pathname) {
      const { resultsStore, match } = this.props;

      resultsStore.clear();
      resultsStore.getCategory(match.params.category);
    }
  }

  componentWillUnmount() {
    const { resultsStore } = this.props;

    resultsStore.clear();
  }

  render() {
    const { resultsStore } = this.props;
    const { category } = resultsStore;
    
    if (!resultsStore.fetched) {
      return <Loading />;
    }
  
    const results = resultsStore.results;

    return(
      <main>
        <MetaData
          title={`${category.name}`}
          metaDescription={`${category.intro}`}
        />
        <div className="category__search-box flex-container flex-container--justify">
          <div className="category__search-box__inner flex-col--tablet--12 flex-col--12">
            <div className="flex-container">
              <div className="flex-col flex-col--8 flex-col--standard--12">
                <Breadcrumb crumbs={[{ text: 'Home', url: '/' }, { text: category.name, url: '' }]} />
                <h1 className="category__heading"><FontAwesomeIcon icon={category.icon} /> {category.name}</h1>
                <p className="category__intro">{category.intro}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="category__list">
          {resultsStore.nhsResult &&
            <div className="flex-container flex-container--justify results__nhs-results">
              <div className="flex-col--tablet--12 flex-col--10">
                <div className="flex-container">
                  <div className="flex-col flex-col--12">
                    <Cta
                      title={resultsStore.nhsResult.about.name}
                      description={resultsStore.nhsResult.description}
                      buttonUrl={resultsStore.nhsResult.url.replace('api.nhs.uk', 'www.nhs.uk')}
                      />
                  </div>
                </div>
              </div>
            </div>
          }

          <div className="flex-container flex-container--justify">
            {results.size > 0 ? (
              <div className="flex-col--12 results__list">
                {results.size && (
                  [...results.entries()].map((results, i) => {
                    const [title, resultsList] = results;

                    return (
                      <List
                        key={i}
                        title={title}
                        resultsList={resultsList}
                        resultsStore={resultsStore}
                      />
                    );
                  })
                )}
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