import React from 'react';
import { Box, Typography, Stack } from '@mui/material';
import Head from 'next/head';

import TeamRowGeneric from '../../components/team/TeamRow';
import styles from '../../styles/components/account/Teams.module.css';
import { useTranslation } from '../../lib/translations';
import { getTeams, Team as ITeam } from '../../lib/api/team';
import { useRequireValidUser } from '../../lib/loginContext';
import { toastError } from '../../components/base/toast/Toast';
import CenteredLoader from '../../components/base/CenteredLoader';

export default function Team() {
  const { i18n } = useTranslation();
  const { credentialsManager, user } = useRequireValidUser();
  const [teams, setTeams] = React.useState<ITeam[]>([]);
  const [fetchLoading, setFetchLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    if (user) {
      getTeams(credentialsManager)
        .then((paginatedTeams) => setTeams(paginatedTeams.data))
        .catch(() =>
          toastError(
            <Typography>{i18n.t('pages.team.index.fetchError')}</Typography>
          )
        )
        .finally(() => setFetchLoading(false));
    }
  }, [i18n, user, credentialsManager]);

  return (
    <>
      <Head>
        <title>{i18n.t('pages.team.index.title')}</title>
      </Head>
      <Box className={styles.container}>
        {/* title */}
        <Box className={styles.titleContainer}>
          <Typography variant="h3" color="inherit">
            {i18n.t('pages.team.index.title')}
          </Typography>
        </Box>

        <Box className={styles.contentContainer}>
          <Box className={styles.captainOf}>
            <Stack className={styles.teamsList} spacing={4}>
              {fetchLoading && <CenteredLoader />}
              {!fetchLoading && teams && teams.length === 0 && (
                <Typography>{i18n.t('pages.team.index.noTeams')}</Typography>
              )}
              {!fetchLoading &&
                teams &&
                teams.map((team) => (
                  <TeamRowGeneric key={team.id} team={team} />
                ))}
            </Stack>
          </Box>
        </Box>
      </Box>
    </>
  );
}
