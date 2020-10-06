import React, { Component, Fragment } from 'react';
import { observer, inject } from 'mobx-react';
import { History } from 'history';

import './Collection.scss';
import ResultStore from '../../../stores/resultsStore';

interface IProps {
  resultsStore: ResultStore;
  history: History;
}

class Collection extends Component<IProps> {
  render() {
    return(
      <Fragment>

      </Fragment>
    )

  }
}

export default inject('resultsStore')(observer(Collection));