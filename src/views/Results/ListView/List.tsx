import React, { Fragment, FunctionComponent } from 'react';
import { IService } from '../../../types/types';
import find from 'lodash/find';
import SearchResultCard from '../../../components/SearchResultCard';
import ResultsStore from '../../../stores/resultsStore';

interface IProps {
  title: string;
  resultsList: IService[];
  resultsStore: ResultsStore;
  activeId?: string;
}

const List: FunctionComponent<IProps> = ({ title, resultsList, resultsStore, activeId }) => {
  return (
    <Fragment key={title}>
      <div className="results__container">
        {resultsList.map((list: any) => {
          const organisation = find(resultsStore.organisations, ['id', list.organisation_id]) || null;
          return <SearchResultCard key={list.id} isActive={activeId === list.id} result={list} organisation={organisation} />;
        })}
      </div>
    </Fragment>
  );
};
export default List;
