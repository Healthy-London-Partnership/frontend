import React, { Component } from 'react';
import Button from '../../components/Button';
import { inject, observer } from 'mobx-react';
import queryString from 'query-string';

import { IService } from '../../types/types';

import FavouritesCard from './FavouritesCard';
import FavouriteShare from './FavouriteShare';

import './Favourites.scss';
import { Link, withRouter, RouteComponentProps } from 'react-router-dom';
import FavouritesStore from '../../stores/favouritesStore';
import CMSStore from '../../stores/CMSStore';
import get from 'lodash/get';

import MetaData from '../../components/MetaData';
import Breadcrumb from '../../components/Breadcrumb';

interface IProps extends RouteComponentProps {
  favouritesStore: FavouritesStore;
  cmsStore: CMSStore;
}
class Favourites extends Component<IProps> {
  componentDidMount() {
    const { location, favouritesStore } = this.props;
    const { ids } = queryString.parse(location.search);

    if (ids) {
      favouritesStore.setFavourites(ids as string);
    } else {
      favouritesStore.getFavouritesFromStorage();
    }

    if (favouritesStore.favouritesList && favouritesStore.favouritesList.length) {
      favouritesStore.fetchFavourites();
    }
  }

  render() {
    const { favouritesStore, cmsStore, history } = this.props;

    return (
      <main className="favourites">
        <MetaData
          title="Favourites"
          metaDescription="Favourites"
        />
        <div className="favourites__header flex-container flex-container--justify">
          <div className="favourites__header__inner flex-col--10 flex-col--tablet-large--12">
            <Breadcrumb crumbs={[{ text: 'Home', url: '/' }, { text: 'Favourites', url: '' }]} />
            <div className="flex-col flex-col--12 favourites__header--heading">
              <h1>{get(cmsStore, 'favourites.title')}</h1>
            </div>
            <div className="flex-container flex-container--no-padding">
              <div className="flex-col flex-col--6 flex-col--mobile--12 flex-col--tablet--12 flex-col--tablet-large--4">
                <p>{get(cmsStore, 'favourites.content')}</p>
              </div>
              <div className="flex-col flex-col--6 flex-col--medium--6 flex-col--tablet-large--7 mobile-hide tablet-hide">
                <FavouriteShare />
              </div>
            </div>
          </div>
        </div>

        <div className="favourites__content flex-container flex-container--justify">
          <div className="favourites__content__inner flex-col--10 flex-col--tablet-large--12">
            {!!favouritesStore.favourites.length ? (
              <div className="flex-container flex-container--no-padding flex-container--justify">
                <div className="flex-col text-align-center favourites__count">
                  <p>{`${favouritesStore.favourites.length} results found`}</p>
                </div>

                <div className="flex-col flex-col--12">
                  <div className="flex-container flex-container--no-padding">
                    {favouritesStore.favourites.map((favourite: IService) => {
                      return (
                        <FavouritesCard
                          key={favourite.id}
                          service={favourite}
                          locations={favouritesStore.getLocations(favourite.id)}
                          removeFavourite={favouritesStore.removeFavourite}
                        />
                      );
                    })}
                  </div>
                </div>

                <div className="flex-container mobile-show tablet-show">
                  <FavouriteShare />
                </div>
              </div>
            ) : (
              <div className="flex-container flex-container--justify">
                <div className="flex-col">
                  <h3>No favourites saved</h3>
                </div>
              </div>
            )}

            <div className="flex-container flex-container--justify">
              <div className="favourites__add-more">
                <Link to="/">
                  <Button text="Add more" icon="plus" onClick={() => history.push('/')} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }
}

export default inject('favouritesStore', 'cmsStore')(withRouter(observer(Favourites)));
