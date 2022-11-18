import { Box, Button, Stack, Typography, useTheme } from '@mui/material';
import Head from 'next/head';
import Link from 'next/link';
import React from 'react';
import { useTranslation } from '../lib/translations';

import styles from '../styles/pages/404.module.css';

export default function ErrorPage() {
  const theme = useTheme();
  const { i18n } = useTranslation();

  // TODO Add the picture with the bunny
  return (
    <>
      <Head>
        <title>{i18n.t('pages.404.title')}</title>
      </Head>
      <Box className={styles.container}>
        <Stack
          spacing={3}
          alignItems="center"
          color={theme.palette.text.primary}
        >
          <Typography variant="h1">{i18n.t('pages.404.title')}</Typography>
          <Typography variant="body1">{i18n.t('pages.404.message')}</Typography>
          <Link href="/">
            <Button
              variant="contained"
              sx={{
                color: theme.palette.primary.contrastText,
                backgroundColor: theme.palette.primary.main,
              }}
            >
              {i18n.t('pages.404.button')}
            </Button>
          </Link>
        </Stack>
      </Box>
    </>
  );
}
