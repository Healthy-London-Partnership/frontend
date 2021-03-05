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
  constructor(props: IProps | Readonly<IProps>) {
    super(props);

    this.state = {
      isOpen: false,
    };
  }

  componentDidMount() {
    const { resultsStore } = this.props;

    resultsStore?.getSearchTerms();
    resultsStore?.getActivityTypes();
  }

  openModal = () => {
    this.setState({
      isOpen: true,
    });
  };

  closeModal = () => {
    this.setState({
      isOpen: false,
    });
  };

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
    console.log(output);
    return output;
  };

  render() {
    const { isOpen } = this.state;
    const { resultsStore } = this.props;
    const activityTypes = resultsStore?.activityTypes;

    return (
      <Fragment>
        <div className="flex-col results__filters__col">
          <label htmlFor="activity_type" className="results__filters__heading">
            Activity Type
          </label>
          {/*<div className="activity-filter" onClick={this.openModal}>*/}
          {/*  {resultsStore?.activityTypeSelected?.length === 0*/}
          {/*    ? 'Select activity type'*/}
          {/*    : `${resultsStore?.activityTypeSelected?.length} activities selected`*/}
          {/*  }*/}
          {/*</div>*/}
          <Popup
            trigger={
              <div className="activity-filter">
                {resultsStore?.activityTypeSelected?.length === 0
                  ? 'Select activity type'
                  : `${resultsStore?.activityTypeSelected?.length} activities selected`
                }
              </div>
            }
            position="bottom left"
            className="my-popup"
            nested={true}
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
                          {/*<input*/}
                          {/*  type="checkbox"*/}
                          {/*  id={String(val.value)}*/}
                          {/*  name={String(val.value)}*/}
                          {/*  checked={*/}
                          {/*    !!resultsStore?.activityTypeSelected?.includes(String(val.value))*/}
                          {/*  }*/}
                          {/*  onChange={() =>*/}
                          {/*    resultsStore?.setActivityTypeSelected(String(val.value))*/}
                          {/*  }*/}
                          {/*/>*/}
                          {/*<label htmlFor={String(val.value)}>{val.text}</label>*/}
                          <Checkbox
                            className={'ddd'}
                            label={val.text}
                            id={String(val.value)}
                            checked={
                              !!resultsStore?.activityTypeSelected?.includes(String(val.value))
                            }
                            onChange={() =>
                              resultsStore!.setActivityTypeSelected(String(val.value))
                            }
                          />
                        </li>
                      ))}
                    </ul>
                  ))}
                </div>
              </div>
              <div className="activity-filter__footer">
                <Button
                  size="small"
                  text="Clear all"
                  onClick={resultsStore?.clearActivityTypeSelected}
                />
                <Button
                  size="small"
                  text="Apply filters"
                />
              </div>
            </div>
          </Popup>
        </div>
      </Fragment>
    );
  }
}

export default withRouter(observer(ActivityTypeFilter));


