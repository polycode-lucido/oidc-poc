import React from 'react';
import { Box } from '@mui/material';
import { useRouter } from 'next/router';
import Head from 'next/head';
import ProfilePanel from '../../components/account/Profile';
import styles from '../../styles/pages/account/common.module.css';
import { useTranslation } from '../../lib/translations';

export default function Profile() {
  const router = useRouter();
  const { id } = router.query;
  const { i18n } = useTranslation();

  return (
    <>
      <Head>
        <title>{i18n.t('pages.account.id.title')}</title>
      </Head>
      <Box className={styles.container}>
        <Box className={styles.contentContainer}>
          <ProfilePanel userId={id as string} />
        </Box>
      </Box>
    </>
  );
}
