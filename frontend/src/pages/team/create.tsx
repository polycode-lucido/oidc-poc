import React from 'react';
import { Box, Divider } from '@mui/material';
import Head from 'next/head';
import styles from '../../styles/pages/account/common.module.css';
import TeamCreationPanel from '../../components/team/TeamCreationPanel';
import { useTranslation } from '../../lib/translations';
import { useRequireValidUser } from '../../lib/loginContext';

export default function CreateTeam() {
  const { i18n } = useTranslation();

  useRequireValidUser();

  return (
    <>
      <Head>
        <title>{i18n.t('pages.team.create.title')}</title>
      </Head>
      <Box className={styles.container}>
        <Box className={styles.contentContainer}>
          <Divider orientation="vertical" flexItem className={styles.divider} />
          <TeamCreationPanel />
        </Box>
      </Box>
    </>
  );
}
