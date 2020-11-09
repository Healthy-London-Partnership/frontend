import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { RouteComponentProps } from 'react-router';

import './Organisation.scss';
import ResultsStore from '../../../stores/resultsStore';

import MetaData from '../../../components/MetaData/MetaData';
import Breadcrumb from '../../../components/Breadcrumb/Breadcrumb';
import Link from '../../../components/Link/Link';
import Loading from '../../../components/Loading/Loading';

interface RouteParams {
  organisation: string;
}

interface IProps extends RouteComponentProps<RouteParams> {
  resultsStore: ResultsStore;
}

class Organisation extends Component<IProps> {
  componentDidMount() {
    const { resultsStore, match } = this.props;
    
    resultsStore.getTaxonomiesOrganisation(match.params.organisation);
  }

  componentDidUpdate(prevProps: IProps) {
    if (prevProps.location.pathname !== this.props.location.pathname) {
      const { resultsStore, match } = this.props;

      resultsStore.clear();
      resultsStore.getTaxonomiesOrganisation(match.params.organisation);
    }
  }

  componentWillUnmount() {
    const { resultsStore } = this.props;

    resultsStore.clear();
  }

  render() {
    const { resultsStore } = this.props;
    const { taxonomyOrganisation } = resultsStore;
    
    if (!taxonomyOrganisation) {
      return <Loading />;
    }

    return(
      <main>
        <MetaData
          title={`${taxonomyOrganisation.name}`}
        />
        <div className="taxonomy__search-box flex-container flex-container--justify">
          <div className="taxonomy__search-box__inner flex-col--tablet--12 flex-col--10">
            <div className="flex-container">
              <div className="flex-col flex-col--8 flex-col--standard--12">
                <Breadcrumb crumbs={[{ text: 'Home', url: '/' }, { text: taxonomyOrganisation.name, url: '' }]} />
                <h1 className="taxonomy__heading">{taxonomyOrganisation.name}</h1>
              </div>
            </div>
          </div>
        </div>

        <div className="taxonomy__list">
          <div className="flex-container flex-container--justify">
            {taxonomyOrganisation.children ? (
              <div className="flex-col--tablet--12 flex-col--10 taxonomy__list">
                <div className="flex-container">
                  <div className="flex-col flex-col--8 flex-col--standard--12">
                    <ul>
                      {taxonomyOrganisation.children.map((item: any, i: number) => {
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
                    <h3>There are no results for this organisation</h3>
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

export default inject('resultsStore')(observer(Organisation));