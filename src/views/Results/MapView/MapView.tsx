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
  markers: any;
  bounds: LatLngBounds;
}

const CENTRE_OF_MAP: [number, number] = [52.8170759, -4.5698321];
const TOP_LEFT_CORNER: [number, number] = [49.959999905, -7.57216793459];
const BOTTOM_RIGHT_CORNER: [number, number] = [58.6350001085, 1.68153079591];

class MapView extends Component<IProps, IState> {  
  constructor(props: IProps) {
    super(props);

    this.state = {
      markers: [],
      bounds: latLngBounds(TOP_LEFT_CORNER, BOTTOM_RIGHT_CORNER),
    };;
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

  getMarkers = (results: any) => {
    let { markers } = this.state;

    if(results) {
      markers.length = 0;

      {results[1].map((result: any) => {
        if (result.service_locations) {
          return result.service_locations.map((serviceLocation: IServiceLocation) => {	
            markers.push(
              {
                type: result.type,
                lat: serviceLocation.location.lat,
                lon: serviceLocation.location.lon
              }
            );
          });
        }

        return null;
      })}
    }
  };

  getMarkerType = (type: string) => {
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

    if([...resultsStore.results.entries()]) {
      this.getMarkers([...resultsStore.results.entries()][0]);
      this.addMarkers([...resultsStore.results.entries()][0]);
    }

    return (
      <main className="flex-container flex-container--justify">
        <div className="flex-col--tablet--12 flex-col--10">
          <div className="flex-container flex-container--space flex-container--row-reverse map">
            <div className="flex-col--6 flex-col--mobile--12 map__map-container">
              <Map
                center={CENTRE_OF_MAP}
                attributionControl={false}
                bounds={this.state.bounds}>
                <TileLayer url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/rastertiles/voyager/{z}/{x}/{y}.png" />
                
                {this.state.markers.map((marker: any, id: string) =>
                  <Marker	
                    key={id}
                    position={[marker.lat, marker.lon]}
                    icon={this.getMarkerType(marker.type)}
                  />
                )}
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