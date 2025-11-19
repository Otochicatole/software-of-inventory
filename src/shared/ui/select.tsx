import React from 'react';
import styles from '../styles/select.module.css';

interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label?: string;
  options: SelectOption[];
  value: string | number;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  placeholder?: string;
  name: string;
  containerClassName?: string;
  labelClassName?: string;
}

const Select: React.FC<SelectProps> = ({
  label,
  options,
  value,
  onChange,
  placeholder,
  name,
  containerClassName,
  labelClassName,
  className,
  ...rest
}) => {
  const containerClasses = [styles.selectContainer, containerClassName].filter(Boolean).join(" ");
  const labelClasses = [styles.label, labelClassName].filter(Boolean).join(" ");
  const selectClasses = [styles.select, className].filter(Boolean).join(" ");

  return (
    <div className={containerClasses}>
      {label && <label htmlFor={name} className={labelClasses}>{label}</label>}
      <select
        id={name}
        name={name}
        className={selectClasses}
        value={value}
        onChange={onChange}
        {...rest}
      >
        {placeholder && <option value="" disabled>{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
