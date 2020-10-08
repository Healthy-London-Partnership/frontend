import React, { Component } from 'react';
import { Map, Marker, TileLayer } from 'react-leaflet';
import map from 'lodash/map';

import { latLngBounds, LatLngBounds } from 'leaflet';
import { observer, inject } from 'mobx-react';

import { ActivityMarker, GroupMarker, ServiceMarker, ClubMarker } from './icons';
import List from './../ListView/List';

import './MapView.scss';
import ResultsStore from '../../../stores/resultsStore';
import { IServiceLocation, IService } from '../../../types/types';

interface IProps {
  resultsStore?: ResultsStore;
}

interface IState {
  markers: [];
  bounds: LatLngBounds;
}

const CENTRE_OF_KINGSTON: [number, number] = [51.378583, -0.280582];
const TOP_LEFT_CORNER: [number, number] = [51.412437, -0.329297];
const BOTTOM_RIGHT_CORNER: [number, number] = [51.403871, -0.288459];

class MapView extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      markers: [],
      bounds: latLngBounds(TOP_LEFT_CORNER, BOTTOM_RIGHT_CORNER),
    };
  }

  addMarkers = (results: any) => {
    if (results) {
      map(results[1], (result: IService) => {
        if (result.service_locations) {
          result.service_locations.forEach((location: IServiceLocation) =>
            this.state.bounds.extend([location.location.lat, location.location.lon])
          );
        }
      });
    }
  };

  getMarker = (type: string) => {
    switch (true) {
      case type === 'service':
        return ServiceMarker;
      case type === 'group':
        return GroupMarker;
      case type === 'activity':
        return ActivityMarker;
      case type === 'club':
        return ClubMarker;
      default:
        break;
    }
  };

  render() {
    const { resultsStore } = this.props;

    if (!resultsStore) {
      return;
    }

    this.addMarkers([...resultsStore.results.entries()][0]);

    return (
      <main className="flex-container flex-container--justify">
        <div className="flex-col--tablet--12 flex-col--10">
          <div className="flex-container flex-container--space flex-container--row-reverse map">
            <div className="flex-col--6 flex-col--mobile--12 map__map-container">
              <Map cente={CENTRE_OF_KINGSTON} attributionControl={false} bounds={this.state.bounds}>
                <TileLayer url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/rastertiles/voyager/{z}/{x}/{y}.png" />
                {[...resultsStore.results.entries()].map((results, i) => {
                  results[1].map((result: any) => {return result.service_locations.map((serviceLocation: IServiceLocation) => {
                      return (
                        <Marker
                          key={serviceLocation.id}
                          position={[serviceLocation.location.lat, serviceLocation.location.lon]}
                          icon={this.getMarker(result.type)}
                        />
                      );
                    });
                  })

                  return null;
                })}
              </Map>
            </div>
            
            <div className="flex-col--6 flex-col--mobile--12 map__results-container">
              {resultsStore.results.size ? (
                [...resultsStore.results.entries()].map((results, i) => {
                  const [title, resultsList] = results;

                  return (
                    <List
                      key={title}
                      title={title}
                      resultsList={resultsList}
                      resultsStore={resultsStore}
                    />
                  );
                })
              ) : (
                <h1>
                  {resultsStore.isPostcodeSearch
                    ? 'There are currently no service offers available in your area.'
                    : 'There are currently no service offers available.'}
                </h1>
              )}  
            </div>
          </div>
        </div>
      </main>
    );
  }
}

export default inject('resultsStore')(observer(MapView));