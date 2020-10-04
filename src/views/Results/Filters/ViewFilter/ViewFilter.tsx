import React, { Fragment, Component } from 'react';
import { inject, observer } from 'mobx-react';

import { withRouter, RouteComponentProps } from 'react-router';

import Button from '../../../../components/Button';
import ResultsStore from '../../../../stores/resultsStore';
import './ViewFilter.scss';

interface IProps extends RouteComponentProps {
  resultsStore?: ResultsStore;
}

@inject('resultsStore')
@observer
class ViewFilter extends Component<IProps> {
  render() {
    const { resultsStore } = this.props;

    if (!resultsStore) {
      return null;
    }

    return (
      <Fragment>
        <div className="view-filter__filter">
          <p className="view-filter__filter__header">View as:</p>
          <Button
            text="Grid"
            icon="th-large"
            size="small"
            light={resultsStore.view !== 'grid'}
            onClick={() => {
              resultsStore.toggleView('grid');
              this.props.history.push({
                pathname: '/results',
                search: resultsStore!.amendSearch()
              });
            }}
          />
          <Button
            text="Map"
            icon="map"
            size="small"
            light={resultsStore.view !== 'map'}
            onClick={() => {
              resultsStore.toggleView('map');
              this.props.history.push({
                pathname: '/results',
                search: resultsStore!.amendSearch()
              });
            }}
          />
        </div>
      </Fragment>
    );
  }
};

export default withRouter(ViewFilter);