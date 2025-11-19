"use client";
import React from "react";
import styles from "@/shared/styles/search-bar.module.css";

interface SearchBarProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  placeholder?: string;
  onChange?: (value: string) => void;
  value?: string;
  className?: string;
}
export default function SearchBar({
  placeholder = "",
  onChange,
  value,
  className,
  ...rest
}: SearchBarProps) {
  const inputValue = value ?? "";
  const classes = [styles.searchBar, className].filter(Boolean).join(" ");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.currentTarget.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onChange?.((e.currentTarget as HTMLInputElement).value);
      (e.currentTarget as HTMLInputElement).blur();
    }
  };

  return (
    <input
      type="text"
      placeholder={placeholder}
      value={inputValue}
      onChange={handleChange}
      className={classes}
      onKeyDown={handleKeyDown}
      aria-label={placeholder || "search"}
      {...rest}
    />
  );
}
