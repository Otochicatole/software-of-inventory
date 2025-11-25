"use client";
import {useState, useEffect, ChangeEvent, CSSProperties} from "react";
import styles from '@/shared/styles/input.module.css'

interface InputProps {
  type?: "text" | "email" | "password" | "number" |"textarea";
  placeholder?: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  style?: CSSProperties;
  validate?: (value: string) => string | null;
  required?: boolean;
  disabled?: boolean;
  name?: string;
  min?: string | number;
  max?: string | number;
}

export default function Input({
  type = "text",
  placeholder = "Type something...",
  value,
  onChange,
  className = "",
  style,
  validate,
  required = false,
  disabled = false,
  name,
  min,
  max,
}: InputProps) {
  const [internalValue, setInternalValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (validate && value) {
      setError(validate(value));
    } else if (validate && internalValue) {
      setError(validate(internalValue));
    } else {
      setError(null);
    }
  }, [value, internalValue, validate]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    if (value === undefined) {
      setInternalValue(newValue);
    }

    if (onChange) {
      onChange(e);
    }
  };

  const inputValue = value !== undefined ? value : internalValue;

  return (
    <>
      <input
        type={type}
        className={className == "" ? error ? styles.inputError : styles.input : className}
        style={style}
        placeholder={placeholder}
        value={inputValue}
        onChange={handleChange}
        required={required}
        disabled={disabled}
        name={name}
        min={min}
        max={max}
      />
      {error && <p className={styles.errorMessage}>{error}</p>}
    </>
  );
}
