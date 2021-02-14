import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { withRouter, RouteComponentProps } from 'react-router'
import { apiBase } from '../../config/api';
import './CategoryList.scss';
import UIStore from '../../stores/uiStore';
import PhysicalActivityImg from '../../assets/images/illustrations/physical-activity.svg';

import { ICategory } from '../../types/types';
import LocationModal from '../LocationModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface IProps extends RouteComponentProps {
  uiStore?: UIStore;
  categories: ICategory[];
}

@inject('uiStore')
@observer
class CategoryList extends Component<IProps, any> {
  render() {
    const { uiStore, categories, history } = this.props;

    if (!uiStore) {
      return null;
    }

    return (
      <div className="category-list">
        <div
          className="category-list__item"
          key="physical-activity"
          onClick={() => uiStore.toggleLocationModal()}>
          <span className="category-list__item__title">
            Physical Activity
          </span>
          <span className="category-list__item__image">
            <img src={PhysicalActivityImg} alt="Physical Activity" />
          </span>
          <span className="category-list__item__icon">
            <FontAwesomeIcon icon="chevron-right" />
          </span>
        </div>
        {categories.map(({ name, id, image, slug }) => (
          <div
            className="category-list__item"
            key={id}
            onClick={() => {
              history.push({
                pathname: `/collections/categories/${slug}`,
              });
            }}>
            <span className="category-list__item__title">
              {name}
            </span>
            <span className="category-list__item__image">
              <img
                src={`${apiBase}/collections/categories/${id}/image.png?max_dimension=300`}
                alt={`${name}`}
              />
            </span>
            <span className="category-list__item__icon">
              <FontAwesomeIcon icon="chevron-right" />
            </span>
          </div>
        ))}
        <LocationModal />
      </div>
    );
  }
}

export default withRouter(observer(CategoryList));
