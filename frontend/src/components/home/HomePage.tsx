import React, { useEffect, useState } from 'react';
import { Box, Divider, Typography, useTheme } from '@mui/material';

import HeroTale from './HeroTale';
import HomeContent from './HomeContent';

import styles from '../../styles/pages/Home.module.css';
import { getModules, Module } from '../../lib/api/module';
import { useRequireValidUser } from '../../lib/loginContext';
import { toastError } from '../base/toast/Toast';
import { useTranslation } from '../../lib/translations';

export default function Home() {
  const theme = useTheme();
  const { credentialsManager, validUser } = useRequireValidUser();

  const { i18n } = useTranslation();

  const [modules, setModules] = useState<Module[]>([]);

  useEffect(() => {
    if (validUser) {
      getModules(credentialsManager, {
        limit: 1,
        offset: 0,
        sort: 'date',
        tags: {
          frontpage: true,
          javascript: false,
          python: false,
          rust: false,
          java: false,
        },
      })
        .then((c) => setModules(c.data))
        .catch(() => {
          toastError(
            <Typography>
              {i18n.t('components.home.homePage.moduleError')}
            </Typography>
          );
        });
    }
  }, [credentialsManager, i18n, validUser]);

  return (
    <Box
      className={styles.container}
      sx={{ color: theme.palette.text.primary }}
    >
      <Box className={styles.innerContainer}>
        {/* hero tale */}
        {modules && modules.length >= 1 && <HeroTale module={modules[0]} />}

        {/* Divider */}
        <Divider orientation="vertical" flexItem className={styles.divider} />

        {/* contents */}
        <HomeContent />
      </Box>
    </Box>
  );
}
