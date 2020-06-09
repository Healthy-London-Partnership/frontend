import React, { Fragment, FunctionComponent } from 'react';
import map from 'lodash/map';
import { ISidebox, IService } from '../../../types/types';
import SideboxCard from '../SideboxCard';
import find from 'lodash/find';
import SearchResultCard from '../../../components/SearchResultCard';
import ResultsStore from '../../../stores/resultsStore';

interface IProps {
  title: string;
  hasSideboxes: (titile: string) => ISidebox[] | null;
  resultsList: IService[];
  resultsStore: ResultsStore;
}

const List: FunctionComponent<IProps> = ({ title, hasSideboxes, resultsList, resultsStore }) => (
  <Fragment key={title}>
    <div className="results__container">
      {resultsStore.isCategorySearch && (
        <div className="flex-col--12">
          <h1 className="results__container__title">{title}</h1>
        </div>
      )}
      <div className="flex-col--12">
        {hasSideboxes(title) && (
          <div className="flex-container flex-container--mobile-no-padding results__category-sidebar">
            {map(hasSideboxes(title), (sidebox: ISidebox) => {
              return <SideboxCard sidebox={sidebox} />;
            })}
          </div>
        )}
      </div>
      {resultsList.map((list: any) => {
        const organisation = find(resultsStore.organisations, ['id', list.organisation_id]) || null;

        return <SearchResultCard key={list.id} result={list} organisation={organisation} />;
      })}
    </div>
    {resultsStore.isCategorySearch && <hr className="results__divider" />}
  </Fragment>
);

export default List;
