import { useRouter } from 'next/router';
import React from 'react';
import { Box, Divider, Typography } from '@mui/material';
import Head from 'next/head';

import Menu from '../../../components/team/Menu';

import styles from '../../../styles/pages/account/common.module.css';
import TeamEditionPanel from '../../../components/team/TeamEditionPanel';
import { useRequireValidUser } from '../../../lib/loginContext';
import { defaultTeam, getTeam, Team } from '../../../lib/api/team';
import { toastError } from '../../../components/base/toast/Toast';
import { useTranslation } from '../../../lib/translations';

export default function EditTeam() {
  const router = useRouter();
  const { i18n } = useTranslation();
  const { id } = router.query;
  const { credentialsManager, validUser } = useRequireValidUser();
  const [team, setTeam] = React.useState<Team>(defaultTeam);

  React.useEffect(() => {
    if (id && !Array.isArray(id) && validUser) {
      getTeam(credentialsManager, id)
        .then(setTeam)
        .catch(() =>
          toastError(
            <Typography>{i18n.t('pages.team.edit.fetchError')}</Typography>
          )
        );
    }
  }, [credentialsManager, i18n, id, validUser]);

  return (
    <>
      <Head>
        <title>{i18n.t('pages.team.edit.id.title')}</title>
      </Head>
      <Box className={styles.container}>
        <Box className={styles.contentContainer}>
          <Menu team={team} state="editor" />
          <Divider orientation="vertical" flexItem className={styles.divider} />
          <TeamEditionPanel team={team} />
        </Box>
      </Box>
    </>
  );
}
