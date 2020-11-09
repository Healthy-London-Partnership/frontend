import React, { Component, Fragment } from 'react';
import { observer, inject } from 'mobx-react';
import { withRouter, RouteComponentProps } from 'react-router'

import UIStore from '../../stores/uiStore';

import { ICategory } from '../../types/types';
import Button from '../Button';
import LocationModal from '../LocationModal';

interface IProps extends RouteComponentProps {
  uiStore?: UIStore;
  categories: ICategory[];
  covid?: boolean;
}

@inject('uiStore')
@observer
class CategoryList extends Component<IProps, any> {
  render() {
    const { uiStore, categories, covid, history } = this.props;

    if (!uiStore) {
      return null;
    }

    return (
      <Fragment>
        <Button
          category={true}
          text="Physical Activity"
          key="Physical Activity"
          size="small"
          icon="running"
          onClick={() => uiStore.toggleLocationModal()}
          covid={covid}
        />
        {categories.map(({ name, id, icon, slug }) => (
          <Button
            category={true}
            text={name}
            key={id}
            size="small"
            icon={icon}
            onClick={() => {
              history.push({
                pathname: `/collections/categories/${slug}`,
              });
            }}
            covid={covid}
          />
        ))}
        <LocationModal />
      </Fragment>
    );
  }
}

export default withRouter(observer(CategoryList));
