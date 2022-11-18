import React from 'react';
import { useRouter } from 'next/router';
import { Box, Divider } from '@mui/material';
import Head from 'next/head';

import Menu from '../../components/account/Menu';
import ProfilePanel from '../../components/account/Profile';
import { useLoginContext } from '../../lib/loginContext';
import { useTranslation } from '../../lib/translations';

import styles from '../../styles/pages/account/common.module.css';

export default function Profile() {
  const { user } = useLoginContext();
  const router = useRouter();
  const { i18n } = useTranslation();

  React.useEffect(() => {
    if (user === null) {
      router.push('/sign-in');
    }
  }, [user, router]);

  return (
    <>
      <Head>
        <title>{i18n.t('pages.account.profile.title')}</title>
      </Head>
      <Box className={styles.container}>
        <Box className={styles.contentContainer}>
          <Menu buttonSelected="profile" />
          <Divider orientation="vertical" flexItem className={styles.divider} />
          <ProfilePanel />
        </Box>
      </Box>
    </>
  );
}
