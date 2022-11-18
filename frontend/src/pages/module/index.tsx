import React, { useState } from 'react';
import { useTheme, Button, Box, Divider, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import Head from 'next/head';

import ModulesPanel from '../../components/modules/Modules';
import TagFilter from '../../components/filters/TagFilter';
import SortFilter from '../../components/filters/SortFilter';
import { useTranslation } from '../../lib/translations';

import { useLoginContext } from '../../lib/loginContext';
import { ModuleFilters } from '../../lib/api/module';

import { SortFilterType, TagFilterType } from '../../lib/common/filter';

import styles from '../../styles/pages/module/Modules.module.css';

const DEFAULT_STATE: ModuleFilters = {
  sort: 'date',
  tags: {
    java: true,
    python: true,
    rust: true,
    javascript: true,
  },
  limit: 10,
  offset: 0,
};

export default function Modules() {
  // import mui theme & i18n
  const theme = useTheme();
  const router = useRouter();
  const { i18n } = useTranslation();
  const { user } = useLoginContext();

  // state
  const [filters, setFilter] = useState<ModuleFilters>(DEFAULT_STATE);

  // --- handle events ---
  const handleTagFilterChanges = (tags: TagFilterType) => {
    setFilter({ ...filters, tags });
  };

  const handleSortFiltersChanges = (sort: SortFilterType) => {
    setFilter({ ...filters, sort });
  };

  const handleReset = () => {
    setFilter(DEFAULT_STATE);
  };

  if (user === null) router.push('/sign-in');

  return (
    <>
      <Head>
        <title>{i18n.t('pages.module.index.title')}</title>
      </Head>
      <Box
        className={styles.container}
        sx={{ color: theme.palette.text.primary }}
      >
        <Box className={styles.innerContainer}>
          {/* filters */}
          <Box className={styles.filters}>
            <Typography variant="h5">
              {i18n.t('pages.module.index.filters')}
            </Typography>
            <TagFilter onChange={handleTagFilterChanges} value={filters.tags} />
            <SortFilter
              onChange={handleSortFiltersChanges}
              value={filters.sort}
            />
            <Box className={styles.resetButtonContainer}>
              <Button
                variant="outlined"
                className={styles.resetButton}
                onClick={handleReset}
              >
                {i18n.t('pages.module.index.resetButton')}
              </Button>
            </Box>
          </Box>

          {/* Divider */}
          <Divider orientation="vertical" flexItem className={styles.divider} />

          {/* modules */}
          <ModulesPanel filters={filters} />
        </Box>
      </Box>
    </>
  );
}
