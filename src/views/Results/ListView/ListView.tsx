import React, { Fragment } from 'react';
import Pagination from 'react-js-pagination';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import find from 'lodash/find';
import get from 'lodash/get';
import { observer } from 'mobx-react';

import ResultsStore from '../../../stores/resultsStore';
import Loading from '../../../components/Loading';
import { History } from 'history';
import List from './List';

interface IProps {
  resultsStore: ResultsStore;
  history: History;
}

const ListView: React.FunctionComponent<IProps> = ({ resultsStore, history }) => {
  if (!resultsStore.fetched) {
    return <Loading />;
  }

  return (
    <Fragment>
      <main>
        <div className="flex-container flex-container--justify">
          <div className="flex-col--tablet--12 flex-col--10">
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
              <div className="results__container">
                <h1>
                  {resultsStore.isPostcodeSearch
                    ? 'There are currently no service offers available in your area.'
                    : 'There are currently no service offers available.'}
                </h1>
              </div>
            )}
          </div>
        </div>
      </main>

      <div className="flex-container flex-container--justify pagnation__container">
        {resultsStore.totalItems > resultsStore.itemsPerPage && (	
          <Pagination	
            activePage={resultsStore.currentPage}
            itemsCountPerPage={resultsStore.itemsPerPage}
            totalItemsCount={resultsStore.totalItems}
            pageRangeDisplayed={10}
            onChange={(pageNumber: number) => {	
              resultsStore.paginate(pageNumber);	
              history.push({  
                search: resultsStore.updateQueryStringParameter('page', pageNumber),	
              });	
            }}	
            prevPageText={	
              <span>	
                <FontAwesomeIcon icon="chevron-left" /> Prev	
              </span>	
            }	
            nextPageText={	
              <span>	
                Next <FontAwesomeIcon icon="chevron-right" />	
              </span>	
            }	
            innerClass="pagination"	
            activeClass="pagination--active"	
            itemClass="pagination--number-container"	
            linkClass="pagination--text-number-link"	
            linkClassPrev="pagination--text-nav-link"	
            linkClassNext="pagination--text-nav-link"	
            itemClassPrev="pagination--text-nav-container"	
            itemClassNext="pagination--text-nav-container"	
            hideFirstLastPages={true}	
          />	
        )}	
      </div>
    </Fragment>
  );
};

export default observer(ListView);
