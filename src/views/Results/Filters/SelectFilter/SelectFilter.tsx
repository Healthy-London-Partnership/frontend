import React, { FunctionComponent } from 'react';
import Select from '../../../../components/Select';

interface OptionItems {
  value: string;
  text: string;
}

interface IProps {
  options: OptionItems[];
  title: string;
  selected: string;
  onChange: (e: any) => void;
  id: string;
}

const SelectFilter: FunctionComponent<IProps> = ({ options, title, selected, onChange, id }) => (
  <div className="flex-col results__filters__col">
    <label htmlFor={id} className="results__filters__heading">
      {title}
    </label>

    <Select
      className="results__filters__select"
      options={options}
      id={id}
      placeholder="Select sorting method"
      selected={selected}
      onChange={onChange}
    />
  </div>
);

export default SelectFilter;
