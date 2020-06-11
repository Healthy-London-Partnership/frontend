import React, { Fragment } from 'react';
import find from 'lodash/find';
import get from 'lodash/get';
import { observer } from 'mobx-react';

import ResultsStore from '../../../stores/resultsStore';
import Loading from '../../../components/Loading';
import List from './List';

interface IProps {
  resultsStore: ResultsStore;
}

const ListView: React.FunctionComponent<IProps> = ({ resultsStore }) => {
  if (!resultsStore.fetched) {
    return <Loading />;
  }

  const hasSideboxes = (title: string) => {
    const category = find(resultsStore.categories, ['name', title]);

    if (category) {
      return category.sideboxes;
    }
    if (resultsStore.persona) {
      return get(resultsStore, 'persona.sideboxes', []);
    }

    return null;
  };

  return (
    <Fragment>
      <main>
        {resultsStore.results.size ? (
          [...resultsStore.results.entries()].map((results, i) => {
            const [title, resultsList] = results;

            return (
              <List
                key={title}
                title={title}
                hasSideboxes={hasSideboxes}
                resultsList={resultsList}
                resultsStore={resultsStore}
              />
            );
          })
        ) : (
          <div className="results__container">
            <h1>
              {resultsStore.isPostcodeSearch
                ? 'There are currently no service offers available in your area.'
                : 'There are currently no service offers available.'}
            </h1>
          </div>
        )}
      </main>
    </Fragment>
  );
};

export default observer(ListView);
