import React from 'react';
import { observer } from 'mobx-react';
import Button from '../../../components/Button';
import ServiceStore from '../../../stores/serviceStore';

interface IProps {
  serviceStore: ServiceStore;
}

const ButtonCard: React.FunctionComponent<IProps> = ({ serviceStore }) => (
  <div className="flex-container flex-container--justify service__button-container">
    <div className="flex-col">
      <Button text="Print" icon="print" alt={true} onClick={() => window.print()} />
    </div>
    <div className="flex-col service__button-container--mobile">
      <Button
        text={serviceStore.favourite ? 'In your favourites' : 'Add to favourites'}
        icon="star"
        alt={true}
        onClick={() => serviceStore.addToFavourites()}
        disabled={serviceStore.favourite}
      />
    </div>
  </div>
);

export default observer(ButtonCard);
