import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { RouteComponentProps } from 'react-router';

import ResultsStore from '../../stores/resultsStore';

import './Collections.scss';

import MetaData from '../../components/MetaData/MetaData';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import Link from '../../components/Link/Link';
import Loading from '../../components/Loading/Loading';
import {
  ICategory,
  IPersona
} from '../../types/types';

interface IProps extends RouteComponentProps {
  resultsStore: ResultsStore;
}

class Category extends Component<IProps> {
  componentDidMount() {
    const { resultsStore } = this.props;
    
    resultsStore.getAllCollections();
  }

  componentWillUnmount() {
    const { resultsStore } = this.props;

    resultsStore.clear();
  }

  render() {
    const { resultsStore } = this.props;
    const { categories, personas } = resultsStore;
      
    if (!categories || !personas) {
      return <Loading />;
    }

    return(
      <div>
        <MetaData
          title="Collections"
        />
        <div className="taxonomy__search-box flex-container flex-container--justify">
          <div className="taxonomy__search-box__inner flex-col--tablet--12 flex-col--10">
            <div className="flex-container">
              <div className="flex-col flex-col--8 flex-col--standard--12">
                <Breadcrumb crumbs={[{ text: 'Home', url: '/' }, { text: 'Collections', url: '' }]} />
                <h1 className="taxonomy__heading">Collections</h1>
              </div>
            </div>
          </div>
        </div>

        <div className="categories__list">
          <div className="flex-container flex-container--justify">
            <div className="flex-col--tablet--12 flex-col--10">
              <div className="flex-container">
                <div className="flex-col">
                  <h2 className="taxonomy__list__heading">Categories</h2>

                  {categories ? (
                    <ul className="category__list__items">
                      {[...categories].map((category: ICategory, i: number) => {
                        let categoryUrl = window.location.href + 'categories/' + category.slug;
                        return <li key={i}><Link href={categoryUrl} text={`${category.name} (${categoryUrl})`} size={'medium'} /></li>
                      })}
                    </ul>
                  ) : (
                    <h3>There are no categories</h3>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="personas__list">
          <div className="flex-container flex-container--justify">
            <div className="flex-col--tablet--12 flex-col--10">
              <div className="flex-container">
                <div className="flex-col">
                  <h2 className="taxonomy__list__heading">Personas</h2>

                    {personas ? (
                      <ul className="persona__list__items">
                        {[...personas].map((persona: IPersona, i: number) => {
                          let personaUrl = window.location.href + 'personas/' + persona.slug;
                          return <li key={i}><Link href={personaUrl} text={`${persona.name} (${personaUrl})`} size={'medium'} /></li>
                        })}
                      </ul>
                    ) : (
                      <h3>There are no personas</h3>
                    )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )

  }
}

export default inject('resultsStore')(observer(Category));