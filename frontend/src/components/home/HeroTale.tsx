import React from 'react';
import { Button, Box, Typography } from '@mui/material';
import Link from 'next/link';

import { DEFAULT_IMAGE, Module } from '../../lib/api/module';

import styles from '../../styles/components/home/HeroTale.module.css';
import { useTranslation } from '../../lib/translations';

type Props = {
  module: Module;
};

export default function HeroTale({ module }: Props) {
  const { i18n } = useTranslation();

  return (
    <Box
      className={styles.container}
      sx={{
        backgroundImage: `url(${DEFAULT_IMAGE})`,
        backgroundSize: 'cover',
        borderRadius: '5px',
      }}
    >
      {/* title and button */}
      <Box className={styles.titleAndButtonContainer}>
        {/* title */}
        <Box className={styles.titleContainer}>
          <Typography className={styles.title}>{module.name}</Typography>
        </Box>
        {/* button */}
        <Box className={styles.buttonContainer}>
          <Link href={`/module/${module.id}`}>
            <Button variant="contained" className={styles.button}>
              {i18n.t('components.home.heroTale.tryNow')}
            </Button>
          </Link>
        </Box>
      </Box>
    </Box>
  );
}
