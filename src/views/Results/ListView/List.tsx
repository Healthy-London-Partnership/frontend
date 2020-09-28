import React, { Fragment, FunctionComponent } from 'react';
import map from 'lodash/map';
import { ISidebox, IService } from '../../../types/types';
import SideboxCard from '../SideboxCard';
import find from 'lodash/find';
import SearchResultCard from '../../../components/SearchResultCard';
import ResultsStore from '../../../stores/resultsStore';
import get from 'lodash/get';

interface IProps {
  title: string;

  hasSideboxes: (title: string) => ISidebox[] | null;
  resultsList: IService[];
  resultsStore: ResultsStore;
}

const List: FunctionComponent<IProps> = ({ title, hasSideboxes, resultsList, resultsStore }) => {
  const category = find(resultsStore.categories, ['name', title]);
  const categoryDescription = get(category, 'intro');

  return (
    <Fragment key={title}>
      <div className="results__container">
        {resultsStore.isCategorySearch && (
          <div className="flex-col--12">
            <h1 className="results__container__title">{title.replace('Homepage:', '')}</h1>
            {title !== categoryDescription && categoryDescription && (
              <p className="results__container__description">{categoryDescription}</p>
            )}
          </div>
        )}
        {hasSideboxes(title) && (
          <div className="flex-col--12">
            <div className="flex-container flex-container--mobile-no-padding results__category-sidebar">
              {map(hasSideboxes(title), (sidebox: ISidebox) => {
                return <SideboxCard sidebox={sidebox} />;
              })}
            </div>
          </div>
        )}
        {resultsList.map((list: any) => {
          const organisation =
            find(resultsStore.organisations, ['id', list.organisation_id]) || null;

          return <SearchResultCard key={list.id} result={list} organisation={organisation} />;
        })}
      </div>
      {resultsStore.isCategorySearch && <hr className="results__divider" />}
    </Fragment>
  );
};
export default List;
