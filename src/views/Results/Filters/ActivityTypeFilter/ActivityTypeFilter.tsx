import React, { Fragment, Component } from 'react';
import { inject, observer } from 'mobx-react';
import Popup from 'reactjs-popup';

import './ActivityTypeFilter.scss';
import 'reactjs-popup/dist/index.css';
import { RouteComponentProps, withRouter } from 'react-router';
import ResultsStore from '../../../../stores/resultsStore';
import Button from '../../../../components/Button';
import Checkbox from '../../../../components/Checkbox';

interface IProps extends RouteComponentProps {
  resultsStore?: ResultsStore;
}

@inject('resultsStore')
@observer
class ActivityTypeFilter extends Component<IProps, any> {
  componentDidMount() {
    const { resultsStore } = this.props;

    resultsStore?.getSearchTerms();
    resultsStore?.getActivityTypes();
  }

  groupByAlphabet = (data: any[]) => {
    const output = Object.values(
      data?.reduce((a, item) => {
        const letter = item.text[0];
        if (!a[letter]) {
          a[letter] = [];
        }
        a[letter].push(item);
        return a;
      }, {})
    );
    return output;
  };

  render() {
    const { resultsStore } = this.props;
    const activityTypes = resultsStore?.activityTypes;

    return (
      <Fragment>
        <div className="flex-col results__filters__col">
          <label htmlFor="activity_type" className="results__filters__heading">
            Activity Type
          </label>
          <Popup
            trigger={<div className="activity-filter">Select activity type</div>}
            position="bottom left"
            className="my-popup"
          >
            <div className="activity-filter__content">
              <div className="activity-filter__body">
                <h3 className="activity-filter__body_title">Most popular</h3>
                <div className="activity-filter__content_wrapper">
                  {this.groupByAlphabet(activityTypes || []).map((item: any, index) => (
                    <ul key={index} className="activity-filter__items">
                      <li>{item[0].text[0]}</li>
                      {item.map((val: any, i: string | number | null | undefined) => (
                        <li key={i}>
                          <Checkbox label={val.text} id={String(val.value)} checked={false} />
                        </li>
                      ))}
                    </ul>
                  ))}
                </div>
              </div>
              <div className="activity-filter__footer">
                <Button size="small" text="Clear all" />
                <Button size="small" text="Apply filters" />
              </div>
            </div>
          </Popup>
        </div>
      </Fragment>
    );
  }
}

export default withRouter(observer(ActivityTypeFilter));


