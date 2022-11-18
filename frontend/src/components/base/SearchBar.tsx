import { IconButton, OutlinedInput } from '@mui/material';
import React from 'react';
import SearchIcon from '@mui/icons-material/Search';
import { useTranslation } from '../../lib/translations';

type Props = {
  disabled?: boolean;
  error?: boolean;
};
export default function SearchBar({
  disabled = false,
  error = false,
  ...props
}: Props) {
  const { i18n } = useTranslation();

  const [searchValue, setSearchValue] = React.useState('');

  return (
    <OutlinedInput
      value={searchValue}
      onChange={(e) => setSearchValue(e.target.value)}
      disabled={disabled}
      error={error}
      endAdornment={
        <IconButton type="submit" size="medium">
          <SearchIcon />
        </IconButton>
      }
      placeholder={i18n.t('components.base.searchBar.placeholder')}
      {...props}
    />
  );
}
