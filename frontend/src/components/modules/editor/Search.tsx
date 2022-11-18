import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  List,
  TextField,
} from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';
import useSWR from 'swr';
import { CredentialsManager } from '../../../lib/api/api';
import { useLoginContext } from '../../../lib/loginContext';
import { useTranslation } from '../../../lib/translations';

import styles from '../../../styles/components/modules/Editor/Search.module.css';
import { Item } from './ContentListItem';
import ShortItemPreview from './SearchItemPreview';

type SearchProps<T extends Item> = {
  alreadyAdded: T[];
  addNew: (submodule: T) => void;
  searchFunction: (
    search: string,
    credentialsManager: CredentialsManager
  ) => Promise<T[]>;
  type: string; // type to let swr index the search
  excludeId?: string;
};

export default function Search<T extends Item>({
  alreadyAdded,
  addNew,
  searchFunction,
  type,
  excludeId,
}: SearchProps<T>) {
  const { user, credentialsManager } = useLoginContext();
  const { i18n } = useTranslation();

  const [search, setSearch] = React.useState('');
  const [onlyByUser, setOnlyByUser] = React.useState(false);

  const userId = onlyByUser ? user?.id : undefined;

  const { data, error } = useSWR(
    // fake url to index the search in swr
    `/${type}?q=${search}&user=${userId}&userConnected=${!!user}`,
    () => searchFunction(search, credentialsManager)
  );

  const modules =
    data?.filter(
      (module) =>
        alreadyAdded.findIndex((m) => m.id === module.id) < 0 &&
        module.id !== excludeId
    ) || [];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleOnlyByUserChange = () => {
    setOnlyByUser(!onlyByUser);
  };

  return (
    <Box>
      <Box className={styles.searchField}>
        <TextField
          label={i18n.t('components.modules.editor.search')}
          variant="standard"
          className={styles.searchInput}
          value={search}
          onChange={handleSearchChange}
        />
        <Box className={styles.spacer} />
        <FormGroup>
          <FormControlLabel
            label={
              type === 'module'
                ? i18n.t('components.modules.editor.onlyMyModules')
                : i18n.t('components.modules.editor.onlyMyContents')
            }
            control={
              <Checkbox checked={onlyByUser} onClick={handleOnlyByUserChange} />
            }
          />
        </FormGroup>
      </Box>
      {error && (
        <Box>
          {i18n.t('components.modules.editor.error.search')}:{' '}
          {JSON.stringify(error.message)}
        </Box>
      )}
      <List className={styles.searchResults}>
        {modules.map((module) => (
          <ShortItemPreview
            key={module.id}
            item={module}
            onAdd={() => addNew(module)}
          />
        ))}
      </List>
    </Box>
  );
}
