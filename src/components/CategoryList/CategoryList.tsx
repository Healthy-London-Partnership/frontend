import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { withRouter, RouteComponentProps } from 'react-router'

import './CategoryList.scss';
import UIStore from '../../stores/uiStore';
import WhyConnectImg from '../../assets/images/why-connect.svg';

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
        <button
          className="category-list__item"
          key="physical-activity"
          onClick={() => uiStore.toggleLocationModal()}>
          <span className="category-list__item__title">
            Physical Activity
          </span>
          <span className="category-list__item__image">
            <img src={WhyConnectImg} alt="Why Connect" />
          </span>
          <span className="category-list__item__icon">
            <FontAwesomeIcon icon="chevron-right" />
          </span>
        </button>
        {categories.map(({ name, id, icon, slug }) => (
          <button
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
              <img src={WhyConnectImg} alt="Why Connect" />
            </span>
            <span className="category-list__item__icon">
              <FontAwesomeIcon icon="chevron-right" />
            </span>
          </button> 
        ))}
        <LocationModal />
      </div>
    );
  }
}

export default withRouter(observer(CategoryList));
