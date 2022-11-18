import { useRouter } from 'next/router';
import React from 'react';
import { Box, Divider, Typography } from '@mui/material';
import Head from 'next/head';

import Menu from '../../components/team/Menu';

import styles from '../../styles/pages/account/common.module.css';
import TeamMembersPanel from '../../components/team/TeamMembersPanel';
import { getTeam, Team as ITeam } from '../../lib/api/team';
import { useRequireValidUser } from '../../lib/loginContext';
import { toastError } from '../../components/base/toast/Toast';
import { useTranslation } from '../../lib/translations';

export default function Team() {
  const router = useRouter();
  const { i18n } = useTranslation();
  const { credentialsManager } = useRequireValidUser();
  const { id } = router.query;
  const [team, setTeam] = React.useState<ITeam | undefined>(undefined);

  React.useEffect(() => {
    if (typeof id === 'string') {
      getTeam(credentialsManager, id)
        .then(setTeam)
        .catch(() =>
          toastError(
            <Typography>{i18n.t('pages.team.id.fetchError')}</Typography>
          )
        );
    }
  }, [credentialsManager, i18n, id]);

  return (
    <>
      <Head>
        <title>{team ? team.name : i18n.t('pages.team.id.title')}</title>
      </Head>
      <Box className={styles.container}>
        <Box className={styles.contentContainer}>
          <Menu team={team} state="view" />
          <Divider orientation="vertical" flexItem className={styles.divider} />
          <TeamMembersPanel team={team} />
        </Box>
      </Box>
    </>
  );
}
