import React, { ChangeEvent } from 'react';
import { observer } from 'mobx-react';

import './Select.scss';

interface IOption {
  value: any;
  text: string;
}

interface IProps {
  options: IOption[] | null;
  onChange?: (e: ChangeEvent<HTMLSelectElement>) => void;
  className?: string;
  placeholder: string;
  id: string;
  disabled?: boolean;
  selected?: any;
}

const Select: React.FunctionComponent<IProps> = ({
  options,
  onChange,
  className,
  placeholder,
  id,
  disabled,
  selected,
}) => (
  <select
    className={`select ${className}`}
    onChange={onChange}
    id={id}
    value={selected ? selected : placeholder}
    disabled={disabled}
  >
    <option value={placeholder} disabled={true} hidden={true}>
      {placeholder}
    </option>
    {options && options.map(({ value, text }) => (
      <option key={value} value={value}>
        {text}
      </option>
    ))}
  </select>
);

export default observer(Select);
