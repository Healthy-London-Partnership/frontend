import React, { Fragment } from 'react';
import find from 'lodash/find';
import { observer } from 'mobx-react';

import SearchResultCard from '../../../components/SearchResultCard';

import ResultsStore from '../../../stores/resultsStore';
import { History } from 'history';
import Loading from '../../../components/Loading';

interface IProps {
  resultsStore: ResultsStore;
}

const ListView: React.FunctionComponent<IProps> = ({ resultsStore }) => {
  if (resultsStore.loading) {
    return <Loading />;
  }

  return (
    <Fragment>
      <main>
        {resultsStore.results.size ? (
          [...resultsStore.results.entries()].map((results, i) => {
            const [title, resultsList] = results;
            return (
              <Fragment key={title}>
                <div className="results__container">
                  <div className="flex-col--12">
                    <h1 className="results__container__title">{title}</h1>
                  </div>
                  {resultsList.map((list: any) => {
                    const organisation =
                      find(resultsStore.organisations, ['id', list.organisation_id]) || null;

                    return (
                      <SearchResultCard key={list.id} result={list} organisation={organisation} />
                    );
                  })}
                </div>
                <hr className="results__divider" />
              </Fragment>
            );
          })
        ) : (
          <h1>No results found</h1>
        )}
      </main>
    </Fragment>
  );
};

export default observer(ListView);
