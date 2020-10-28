import React, { Fragment } from 'react';
import Pagination from 'react-js-pagination';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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

  const liveActivities = resultsStore.liveActivities;
  const results = resultsStore.results;
  const nationalResults = resultsStore.nationalResults;

  return (
    <Fragment>
      <main>
        <div className="flex-container flex-container--justify">
          <div className="flex-col--tablet--12 flex-col--10">
            <div className="flex-container flex-container--justify">
              {(results.size || nationalResults.size) ? (
                <Fragment>
                  <div className="flex-col--tablet--12">
                    {liveActivities && (
                      [...liveActivities.entries()].map((results, i) => {
                        const [title, resultsList] = results;

                        return (
                          <List
                            key={i}
                            title={title}
                            resultsList={resultsList}
                            resultsStore={resultsStore}
                          />
                        );
                      })
                    )}
                  </div>
                  {results.size > 0 && (
                    <div className={nationalResults.size ? 'flex-col--tablet--12 flex-col--8 results__list--has-national-results' : 'flex-col--12'}>
                      {results.size && (
                        [...results.entries()].map((results, i) => {
                          const [title, resultsList] = results;

                          return (
                            <List
                              key={i}
                              title={title}
                              resultsList={resultsList}
                              resultsStore={resultsStore}
                            />
                          );
                        })
                      )}
                    </div>
                  )}
                  {nationalResults.size > 0 && (
                    <Fragment>
                      <div className={[...results.entries()][0][1].length ? 'flex-col--tablet--12 flex-col--4 results__list__national-results' : 'flex-col--12'}>
                        {nationalResults.size && (
                          [...nationalResults.entries()].map((results, i) => {
                            const [title, resultsList] = results;

                            return (
                              <List
                                key={i}
                                title={title}
                                resultsList={resultsList}
                                resultsStore={resultsStore}
                              />
                            );
                          })
                        )}
                      </div>
                    </Fragment>
                  )}
                </Fragment>
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
