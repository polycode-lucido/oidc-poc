import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

type Item = {
  name: string;
  value: string;
};

type Props = {
  label: string;
  items: Item[];
  value: string;
  onChange: (event: SelectChangeEvent<string>) => void;
  id?: string;
  size?: 'small' | 'medium';
  minWidth?: number;
};

export default function CustomSelect({
  label,
  items,
  value,
  onChange,
  id,
  size,
  minWidth,
}: Props) {
  return (
    <Box sx={{ minWidth: minWidth ?? 120 }}>
      <FormControl fullWidth>
        {/* label */}
        <InputLabel id={label}>{label}</InputLabel>
        {/* select */}
        <Select
          labelId={label}
          label={label}
          id={id}
          value={value}
          onChange={onChange}
          size={size}
        >
          {/* menu items */}
          {items && items.length > 0
            ? items.map((item: Item) => (
                <MenuItem key={item.name} value={item?.value}>
                  {item?.name}
                </MenuItem>
              ))
            : null}
        </Select>
      </FormControl>
    </Box>
  );
}

CustomSelect.defaultProps = {
  id: 'selectId',
  size: undefined,
};
