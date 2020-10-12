import React, { Fragment } from 'react';
import { observer, inject } from 'mobx-react';
import { withRouter, RouteComponentProps } from 'react-router';
import get from 'lodash/get';

import SearchStore from '../../stores/searchStore';

import './SearchWidget.scss';
import SearchInput from '../../components/SearchInput/SearchInput';
import WindowSizeStore from '../../stores/windowSizeStore';
import CMSStore from '../../stores/CMSStore';

interface IProps extends RouteComponentProps {
  windowSizeStore?: WindowSizeStore;
  cmsStore?: CMSStore;
}

@inject('windowSizeStore', 'cmsStore')
@observer
class Search extends React.Component<IProps> {
  componentWillUnmount() {
    SearchStore.clear();
  }

  render() {
    const { windowSizeStore, cmsStore } = this.props;

    // injected stores must be typed as optional, but will always be there if injected. Allows workound for destructuring values from store
    if (!windowSizeStore || !cmsStore) {
      return null;
    }

    return (
      <Fragment>
        <section className="search-widget">
          <form className="flex-container flex-container--mobile-no-padding">
            <div className="flex-col--12">
              <h1 className="search-widget__heading">{get(cmsStore, 'home.search_title')}</h1>
            </div>
            <SearchInput showButtonText={true} keywordFieldLabel="Enter a keyword" postcodeFieldLabel="Enter a location" />
          </form>
        </section>
      </Fragment>
    );
  }
}

export default withRouter(Search);
