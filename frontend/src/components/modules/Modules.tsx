import React, { useState, useEffect } from 'react';
import { useTheme, Box, Typography } from '@mui/material';

import ModuleList from './ModuleList';
import { useTranslation } from '../../lib/translations';

import styles from '../../styles/components/modules/Modules.module.css';

import { toastError } from '../base/toast/Toast';
import { getModules, ModuleFilters, Module } from '../../lib/api/module';
import { useRequireValidUser } from '../../lib/loginContext';
import CenteredLoader from '../base/CenteredLoader';

type Props = {
  filters: ModuleFilters;
};

export default function Modules({ filters }: Props) {
  // import mui theme & i18n
  const theme = useTheme();
  const { i18n } = useTranslation();
  const { credentialsManager, validUser } = useRequireValidUser();

  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(false);

  // --- handler events ---
  useEffect(() => {
    setLoading(true);
    if (validUser) {
      getModules(credentialsManager, filters)
        .then((c) => setModules(c.data))
        .catch((e) =>
          toastError(
            <Typography>
              {i18n.t('components.modules.modules.fetchError')} : {e.message}
            </Typography>
          )
        )
        .finally(() => setLoading(false));
    }
  }, [filters, validUser, credentialsManager, i18n]);

  return (
    <Box className={styles.container}>
      {/* title */}
      <Typography variant="h3" sx={{ color: theme.palette.primary.main }}>
        {i18n.t('components.modules.modules.title')}
      </Typography>

      {/* list of modules */}
      {!loading ? <ModuleList modules={modules} /> : <CenteredLoader />}
    </Box>
  );
}
