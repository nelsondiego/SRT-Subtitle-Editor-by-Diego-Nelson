"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";

interface DebouncedInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  value: string;
  onChange: (value: string) => void;
  debounceTimeout?: number;
}

export function DebouncedInput({
  value: initialValue,
  onChange,
  debounceTimeout = 300,
  ...props
}: DebouncedInputProps) {
  const [value, setValue] = React.useState(initialValue);

  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      if (value !== initialValue) {
        onChange(value);
      }
    }, debounceTimeout);

    return () => clearTimeout(timeout);
  }, [value, initialValue, debounceTimeout, onChange]);

  return (
    <Input
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}