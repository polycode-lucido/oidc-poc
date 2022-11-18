import React from 'react';
import { Box, Typography } from '@mui/material';

import Module from '../modules/Module';
import { Module as ModuleType } from '../../lib/api/module';

import styles from '../../styles/components/home/HomeModuleList.module.css';
import { useTranslation } from '../../lib/translations';

type Props = {
  title: string;
  modules: ModuleType[];
};

const MAX_MODULES = 3;

export default function HomeModuleList({ title, modules }: Props) {
  const { i18n } = useTranslation();

  return (
    <Box className={styles.container}>
      <Box>
        <Typography className={styles.title}>{title}</Typography>
      </Box>
      <Box className={styles.moduleList}>
        {modules && modules.length > 0
          ? modules.slice(0, MAX_MODULES).map((module) => (
              <Box key={module.id}>
                <Module module={module} />
              </Box>
            ))
          : i18n.t('components.home.homeContent.empty.modules')}
      </Box>
    </Box>
  );
}
