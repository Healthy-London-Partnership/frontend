import React from 'react';
import { inject, observer } from 'mobx-react';

import ResultsStore from '../../../stores/resultsStore';
import '../Results.scss';

interface IProps {
  resultsStore?: ResultsStore;
}

const Category: React.FunctionComponent<IProps> = ({ resultsStore }) => {
  if (!resultsStore) {
    return null;
  }

  return (
    <div className="flex-container">
      <div className="flex-col flex-col--12 flex-col--mobile--12">
        <h1 className="results__keyword-heading">Your personalised results</h1>
      </div>
    </div>
  );
};

export default inject('resultsStore')(observer(Category));
