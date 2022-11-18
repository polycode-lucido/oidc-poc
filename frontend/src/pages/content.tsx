import React, { useState } from 'react';
import { useTheme, Button, Box, Divider, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import Head from 'next/head';

import ContentsPanel from '../components/contents/Contents';
import StateFilter from '../components/filters/StateFilter';
import SortFilter from '../components/filters/SortFilter';
import { ContentFilters } from '../lib/api/content';
import { SortFilterType, StateFilterType } from '../lib/common/filter';

import styles from '../styles/pages/Contents.module.css';
import { useRequireValidUser } from '../lib/loginContext';
import { useTranslation } from '../lib/translations';

const DEFAULT_STATE: ContentFilters = {
  limit: 20,
  offset: 0,
  state: { done: true, started: true },
  sort: 'name',
};

export default function Contents() {
  // import mui theme
  const theme = useTheme();
  const router = useRouter();
  const { user } = useRequireValidUser();
  const { i18n } = useTranslation();

  // state
  const [filters, setFilter] = useState<ContentFilters>(DEFAULT_STATE);

  // --- handler events ---
  const handleStateFilterChanges = (state: StateFilterType) => {
    setFilter({ ...filters, state });
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
        <title>{i18n.t('pages.content.index.title')}</title>
      </Head>
      <Box
        className={styles.container}
        sx={{ color: theme.palette.text.primary }}
      >
        <Box className={styles.innerContainer}>
          {/* filters */}
          <Box className={styles.filters}>
            <Typography variant="h5">
              {i18n.t('pages.content.index.filters')}
            </Typography>
            <StateFilter
              value={filters.state}
              onChange={handleStateFilterChanges}
            />
            <SortFilter
              value={filters.sort}
              onChange={handleSortFiltersChanges}
            />
            <Box className={styles.resetButtonContainer}>
              <Button
                variant="outlined"
                className={styles.resetButton}
                onClick={handleReset}
              >
                {i18n.t('pages.content.index.reset')}
              </Button>
            </Box>
          </Box>

          {/* Divider */}
          <Divider orientation="vertical" flexItem className={styles.divider} />

          {/* contents */}
          <ContentsPanel filters={filters} />
        </Box>
      </Box>
    </>
  );
}
