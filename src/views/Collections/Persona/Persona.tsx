import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { RouteComponentProps } from 'react-router';
import { apiBase } from '../../../config/api';

import './Persona.scss';
import ResultsStore from '../../../stores/resultsStore';

import MetaData from '../../../components/MetaData/MetaData';
import Breadcrumb from '../../../components/Breadcrumb/Breadcrumb';
import List from '../../../views/Results/ListView/List';
import Loading from '../../../components/Loading/Loading';

interface RouteParams {
  persona: string;
}

interface IProps extends RouteComponentProps<RouteParams> {
  resultsStore: ResultsStore;
}

class Persona extends Component<IProps> {
  componentDidMount() {
    const { resultsStore, match } = this.props;
    
    resultsStore.getPersona(match.params.persona);
  }

  componentDidUpdate(prevProps: IProps) {
    if (prevProps.location.pathname !== this.props.location.pathname) {
      const { resultsStore, match } = this.props;

      resultsStore.clear();
      resultsStore.getPersona(match.params.persona);
    }
  }

  componentWillUnmount() {
    const { resultsStore } = this.props;

    resultsStore.clear();
  }

  render() {
    const { resultsStore } = this.props;
    const { persona } = resultsStore;
    
    if (!resultsStore.fetched) {
      return <Loading />;
    }

    if(!persona) {
      return null;
    }
  
    const results = resultsStore.results;

    return(
      <main>
        <MetaData
          title={`${persona.name}`}
          metaDescription={`${persona.intro}`}
        />
        <Breadcrumb crumbs={[{ text: 'Home', url: '/' }, { text: persona.name, url: '' }]} />
        <div className="persona__search-box">
          <div className="flex-container flex-container--justify">
            <div className="flex-col--tablet--12 flex-col--10">
              <div className="flex-container flex-container--no-space flex-container--no-wrap flex-container--align-center">
                <div className="flex-col persona__search-box__logo">
                  <img
                    src={`${apiBase}/collections/personas/${persona.id}/image.png?max_dimension=300`}
                    alt={`Services relating to ${persona.name}`}
                  />
                </div>
                <div className="flex-col flex-col--8 flex-col--standard--12">
                  <h1 className="persona__heading">{persona.name}</h1>
                  <p className="persona__intro">{persona.intro}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="persona__list">
          <div className="flex-container flex-container--justify">
            {results.size > 0 ? (
              <div className="flex-col--tablet--12 flex-col--10 results__list">
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
                    <h3>There are no results for this persona</h3>
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

export default inject('resultsStore')(observer(Persona));