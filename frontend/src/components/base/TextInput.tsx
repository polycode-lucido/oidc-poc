/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { TextField } from '@mui/material';

type Props = {
  label: string;
  value: string;
  type?: string;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
  variant?: 'standard' | 'outlined' | 'filled';
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function TextInput({
  label,
  value,
  type = 'text',
  disabled = false,
  error = false,
  helperText = '',
  variant = 'standard',
  onChange = undefined,
  ...props
}: Props) {
  return (
    <TextField
      fullWidth
      label={label}
      value={value}
      type={type}
      disabled={disabled}
      error={error}
      helperText={helperText}
      onChange={onChange}
      variant={variant}
      {...props}
    />
  );
}
