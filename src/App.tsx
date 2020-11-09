import React, { Component, Fragment } from 'react';

import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider, observer } from 'mobx-react';

import Home from './views/Home/Home';
import NotFound from './views/NotFound/NotFound';
import Collections from './views/Collections/Collections';
import CollectionsCategory from './views/Collections/Category/Category';
import CollectionsPersona from './views/Collections/Persona/Persona';
import TaxonomiesCategory from './views/Taxonomies/Category/Category';
import TaxonomiesOrganisation from './views/Taxonomies/Organisation/Organisation';
import Results from './views/Results';
import Service from './views/Service';
import Favourites from './views/Favourites';
import Referral from './views/Referral';
import AboutConnect from './views/AboutConnect';
import Providers from './views/Providers';
import Supporters from './views/Supporters';
import Funders from './views/Funders';
import Contact from './views/Contact'
import Privacy from './views/Privacy';
import DutyToRefer from './views/DutyToRefer';
import SearchWidget from './views/SearchWidget';

import './styles/grid.scss';

import WindowSizeStore from './stores/windowSizeStore';
import UIStore from './stores/uiStore';
import ResultsStore from './stores/resultsStore';
import ServiceStore from './stores/serviceStore';
import FavouritesStore from './stores/favouritesStore';
import CMSStore from './stores/CMSStore';
import ReferralStore from './stores/referralStore';
import Terms from './views/Terms';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';
import Header from './components/Header';
import FeedbackModal from './components/FeedbackModal';
import Footer from './components/Footer/Footer';
import MetaData from './components/MetaData';
import HomeScreenPrompt from './components/HomeScreenPrompt';
import PublicBetaBanner from './components/PublicBetaBanner';

// add all free font awesome icons to project
library.add(fas, fab);

const windowSizeStore = new WindowSizeStore();
const uiStore = new UIStore();
const resultsStore = new ResultsStore();
const serviceStore = new ServiceStore();
const favouritesStore = new FavouritesStore();
const cmsStore = new CMSStore();
const referralStore = new ReferralStore();

class App extends Component {
  componentDidMount() {
    windowSizeStore.setWindow();
  }
  
  showGlobals() {
    if(window.location.pathname === '/search-widget') return false;
    return true;
  }

  render() {
    return (
      <Provider
        windowSizeStore={windowSizeStore}
        uiStore={uiStore}
        resultsStore={resultsStore}
        serviceStore={serviceStore}
        favouritesStore={favouritesStore}
        cmsStore={cmsStore}
        referralStore={referralStore}
      >
        <MetaData />
        <Router>
          <ScrollToTop>
            {this.showGlobals() &&
              <Fragment>
                <PublicBetaBanner />
                <Header />
              </Fragment>
            }
            <main className="main">
              <Switch>
                <Route path="/" exact={true} component={Home} />
                <Route path="/collections" exact={true} component={Collections} />
                <Route path="/collections/categories/:category" component={CollectionsCategory} />
                <Route path="/collections/personas/:persona" component={CollectionsPersona} />
                <Route path="/taxonomies/categories/:category" component={TaxonomiesCategory} />
                <Route path="/taxonomies/organisations/:organisation" component={TaxonomiesOrganisation} />
                <Route path="/results" component={Results} />
                <Route path="/activities/:activity" component={Service} />
                <Route path="/services/:service" component={Service} />
                <Route path="/favourites" component={Favourites} />
                <Route path="/referral" component={Referral} />
                <Route path="/about-connect" component={AboutConnect} />
                <Route path="/providers" component={Providers} />
                <Route path="/supporters" component={Supporters} />
                <Route path="/funders" component={Funders} />
                <Route path="/contact" component={Contact} />
                <Route path="/privacy-policy" component={Privacy} />
                <Route path="/terms-and-conditions" component={Terms} />
                <Route path="/duty-to-refer" component={DutyToRefer} />
                <Route path="/search-widget" exact={true} component={SearchWidget} />

                <Route component={NotFound} />
              </Switch>
            </main>
            {this.showGlobals() &&
              <Fragment>
                <FeedbackModal />
                <HomeScreenPrompt />
                <Footer />
              </Fragment>
            }
          </ScrollToTop>
        </Router>
      </Provider>
    );
  }
}

export default observer(App);
