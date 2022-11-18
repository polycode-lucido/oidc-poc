import { Box, Button, Typography, useTheme } from '@mui/material';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import styles from '../../styles/components/home/LandingPage.module.css';
import { useTranslation } from '../../lib/translations';

import polybunny from '../../images/polybunny-do.png';

export default function LandingPage() {
  const theme = useTheme();

  const { i18n } = useTranslation();

  return (
    <Box className={styles.container}>
      <Box className={styles.logo}>
        <Image
          className={styles.logo}
          src={polybunny}
          width={1000}
          height={1000}
        />
      </Box>
      <Typography variant="h1" className={styles.center}>
        <span style={{ color: theme.palette.primary.main }}>Poly</span>
        Code
      </Typography>

      <Typography variant="body1" className={styles.center}>
        {i18n.t('components.home.landingPage.manifesto')}
      </Typography>

      <Link href="/sign-up" passHref>
        <Button variant="contained" size="large" className={styles.startButton}>
          {i18n.t('components.home.landingPage.start')}
        </Button>
      </Link>
    </Box>
  );
}
