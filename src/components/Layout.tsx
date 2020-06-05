import React, { Fragment, FunctionComponent } from 'react';
import Header from './Header';
import Footer from './Footer/Footer';
import FeedbackModal from './FeedbackModal';

const Layout: FunctionComponent<any> = ({ children }) => (
  <Fragment>
    <Header />
    {children}
    <FeedbackModal />
    <Footer />
  </Fragment>
);

export default Layout;
