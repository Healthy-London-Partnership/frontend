import React, { Fragment } from 'react';
import { observer, inject } from 'mobx-react';
import { withRouter, RouteComponentProps } from 'react-router';
import cx from 'classnames';
import get from 'lodash/get';

import SearchStore from '../../stores/searchStore';

import './SearchInput.scss';
import Input from '../Input';
import Button from '../Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import WindowSizeStore from '../../stores/windowSizeStore';
import CMSStore from '../../stores/CMSStore';

interface IProps extends RouteComponentProps {
  windowSizeStore?: WindowSizeStore;
  cmsStore?: CMSStore;
}

@inject('windowSizeStore', 'cmsStore')
@observer
class SearchInput extends React.Component<IProps> {
  componentWillUnmount() {
    SearchStore.clear();
  }

  checkValidation(e: React.ChangeEvent<HTMLButtonElement>) {
    e.preventDefault();
    if(SearchStore.search || SearchStore.location) {
      this.props.history.push({
        pathname: '/results',
        search: `?search_term=${SearchStore.search}&location=${SearchStore.location}`,
      });
    } else {
      alert('Please fill in at least one search criteria (keyword/location).');
    }
  }

  render() {
    const { windowSizeStore, cmsStore } = this.props;

    // injected stores must be typed as optional, but will always be there if injected. Allows workound for destructuring values from store
    if (!windowSizeStore || !cmsStore) {
      return null;
    }

    const { isMobile } = windowSizeStore;

    return (
      <Fragment>
        <div
          className={cx('flex-col--12 flex-col--mobile--12 search__input', {
            'flex-col--mobile--12 search__input': isMobile,
          })}
        >
          <div className="flex-container flex-container--no-padding">
            <div className="flex-col--12">
              <h1 className="search__heading">{get(cmsStore, 'home.search_title')}</h1>
            </div>
            <div
              className="flex-container search__wrapper"
              style={{
                width: '100%',
                padding: 0,
                justifyContent: 'start',
              }}
            >
              <div
                className={cx('flex-col--6 flex-col--tablet--12 search__input__item', {
                  'flex-col--mobile--12 search__input__item': isMobile,
                })}
              >
                <label htmlFor="search">Enter a keyword</label>
                <Input
                  placeholder="e.g. Anxiety"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    SearchStore.onChange(e, 'search')
                  }
                  id="search"
                  value={SearchStore.search}
                />
              </div>
              <div
                className={cx('flex-col--6 flex-col--tablet--12 search__input__item', {
                  'flex-col--mobile--12 search__input__item': isMobile,
                })}
              >
                <label htmlFor="search">Enter a location</label>
                <Input
                  placeholder="e.g SW16 7GZ or Camden"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    SearchStore.onChange(e, 'location')
                  }
                  id="location"
                  value={SearchStore.location}
                />
              </div>
              <div
                className={cx('flex-col search__submit', {
                  'flex-col--mobile--12 search__submit': isMobile,
                })}>
                <Button
                  text="Search"
                  icon="search"
                  type="submit"
                  onClick={(e: React.ChangeEvent<HTMLButtonElement>) => this.checkValidation(e)}
                />
              </div>
            </div>
          </div>
          <button
            className="link link--medium search__location__link"
            onClick={(e) => {
              e.preventDefault();
              SearchStore.getLocation();
            }}><FontAwesomeIcon icon="search-location" className="link__icon--left" />Get my location</button>
        </div>
      </Fragment>
    );
  }
}

export default withRouter(SearchInput);
  