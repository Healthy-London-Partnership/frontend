import React, { Component } from 'react';

import { observer, inject } from 'mobx-react';
import cx from 'classnames';
import { NavLink as RouterLink, withRouter, RouteComponentProps } from 'react-router-dom';

import './Header.scss';
import NHSLogo from '../../assets/images/nhs-logo.svg';

import Button from '../Button';
import WindowSizeStore from '../../stores/windowSizeStore';
import UIStore from '../../stores/uiStore';
import Footer from '../Footer/Footer';

interface IProps extends RouteComponentProps {
  windowSizeStore?: WindowSizeStore;
  uiStore?: UIStore;
}

@inject('windowSizeStore', 'uiStore')
@observer
class Header extends Component<IProps> {
  render() {
    const { windowSizeStore, uiStore } = this.props;

    // injected stores must be typed as optional, but will always be there if injected. Allows workound for destructuring values from store
    if (!windowSizeStore || !uiStore) {
      return null;
    }

    const { isMobile } = windowSizeStore;
    const { burgerMenuOpen, toggleBurgerMenu, toggleFeedbackModal } = uiStore;

    return (
      <header
        className={cx('header', {
          active: burgerMenuOpen,
        })}
      >
        <div className="flex-container flex-container--justify header__container">
          <div
            className={cx('flex-col flex-col--5 flex-col--tablet-large--12 header__brand', {
              'header__brand--active': burgerMenuOpen,
              'header__brand--sticky': uiStore.keywordEditOpen,
            })}
          >
            <figure className="logo">
              <RouterLink to="/" aria-label="Home Link">
                <span className="logo-heading">Connect</span>
                <span className="logo-byline">Search for support and advice for health and wellbeing</span>
                <span className="logo-icon"><img src={NHSLogo} alt="NHS" /></span>
              </RouterLink>
            </figure>

            <button
              name="nav-trigger"
              className={cx('nav-trigger tablet--large-show medium-show', {
                active: burgerMenuOpen,
              })}
              onClick={() => toggleBurgerMenu()}
            >
              <span className="nav-trigger--button" />
              <i className="bars fa fa-bars" aria-hidden title="Menu Trigger"></i>
              <span className="sr-only">Menu Trigger</span>
            </button>
          </div>

          <div
            className="header__ctas flex-col flex-col--7 mobile-hide tablet--large-hide medium-hide"
          >
            <div id="google_translate_element" />
            <Button
              text="Give Feedback"
              header={true}
              icon="comment"
              onClick={() => uiStore.toggleFeedbackModal()}
            />
            <RouterLink to="/favourites">
              <Button text="Your Favourites" header={true} icon="star" />
            </RouterLink>
          </div>

          <div className="flex-col flex-col--10 flex-col--tablet-large--12 header__nav">
            <div
              className={cx('flex-container header__content', {
                'header__content--active': burgerMenuOpen,
              })}
            >
              <div
                className="flex-col flex-col--12 flex-col--tablet-large--12 header__navigation tablet--large-hide medium-hide"
                role="navigation"
              >
                <nav className="nav nav--primary" role="menubar" aria-label="Primary Navigation">
                  <RouterLink
                    exact={true}
                    to="/"
                    className="link link__inline link--large link__header"
                    activeClassName={cx({ 'link--active': !isMobile })}
                    onClick={() => {
                      if (burgerMenuOpen) {
                        toggleBurgerMenu();
                      }
                    }}
                  >
                    Home
                  </RouterLink>
                  <RouterLink
                    to="/about-connect"
                    exact={true}
                    className="link link__inline link--large link__header"
                    activeClassName={cx({ 'link--active': !isMobile })}
                    onClick={() => {
                      if (burgerMenuOpen) {
                        toggleBurgerMenu();
                      }
                    }}
                  >
                    About Connect
                  </RouterLink>
                  <RouterLink
                    to="/providers"
                    className="link link__inline link--large link__header"
                    activeClassName={cx({ 'link--active': !isMobile })}
                    onClick={() => {
                      if (burgerMenuOpen) {
                        toggleBurgerMenu();
                      }
                    }}
                  >
                    Providers
                  </RouterLink>
                  <RouterLink
                    to="/supporters"
                    className="link link__inline link--large link__header"
                    activeClassName={cx({ 'link--active': !isMobile })}
                    onClick={() => {
                      if (burgerMenuOpen) {
                        toggleBurgerMenu();
                      }
                    }}
                  >
                    Supporters
                  </RouterLink>
                  <RouterLink
                    to="/funders"
                    className="link link__inline link--large link__header"
                    activeClassName={cx({ 'nav--active': !isMobile })}
                    onClick={() => {
                      if (burgerMenuOpen) {
                        toggleBurgerMenu();
                      }
                    }}
                  >
                    Funders
                  </RouterLink>

                  <div className="mobile-show tablet-show tablet--large-show medium-show">
                    <div id="google_translate_element" />

                    <Button
                      text="Give feedback"
                      size="small"
                      burgerMenu={true}
                      icon="comment"
                      onClick={() => {
                        toggleBurgerMenu();
                        toggleFeedbackModal();
                      }}
                    />
                    <RouterLink to="/favourites">
                      <Button text="View favourites" size="small" burgerMenu={true} icon="star" />
                    </RouterLink>
                  </div>
                </nav>
              </div>
            </div>
          </div>
          {burgerMenuOpen && (
            <div className="header__footer">
              <Footer mobileMenu={true} />
            </div>
          )}
        </div>
      </header>
    );
  }
}

export default withRouter(Header);
