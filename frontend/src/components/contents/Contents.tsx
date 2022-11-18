import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, useTheme } from '@mui/material';

import { toastError } from '../base/toast/Toast';

import ContentList from './ContentList';

import { getContents, ContentFilters, Content } from '../../lib/api/content';
import { useRequireValidUser } from '../../lib/loginContext';

import styles from '../../styles/components/contents/Contents.module.css';
import { useTranslation } from '../../lib/translations';

type Props = {
  filters: ContentFilters;
};

export default function Contents({ filters }: Props) {
  // import mui theme
  const { validUser, credentialsManager } = useRequireValidUser();

  const theme = useTheme();
  const { i18n } = useTranslation();

  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(false);

  // --- handler events ---
  useEffect(() => {
    setLoading(true);
    if (validUser) {
      getContents(credentialsManager, filters)
        .then((c) => setContents(c.data))
        .catch((e) =>
          toastError(
            <Typography>
              {i18n.t('components.contents.contents.fetchError')} : {e.message}
            </Typography>
          )
        )
        .finally(() => setLoading(false));
    }
  }, [filters, validUser, credentialsManager, i18n]);

  return (
    <Box className={styles.container}>
      <Typography variant="h3" sx={{ color: theme.palette.primary.main }}>
        {i18n.t('components.contents.contents.title')}
      </Typography>

      {/* list of contents */}
      {!loading ? (
        <ContentList contents={contents} />
      ) : (
        <Box className={styles.loadingContainer}>
          <CircularProgress size="4rem" />
        </Box>
      )}
    </Box>
  );
}
