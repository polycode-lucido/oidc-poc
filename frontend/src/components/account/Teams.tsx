import React from 'react';
import { Box, Typography, useTheme, Stack, Button } from '@mui/material';
import Link from 'next/link';

import styles from '../../styles/components/account/Teams.module.css';
import { useTranslation } from '../../lib/translations';
import { Team } from '../../lib/api/team';
import { useLoginContext } from '../../lib/loginContext';
import { toastError } from '../base/toast/Toast';
import { getUserTeams } from '../../lib/api/user';
import TeamRow from '../team/TeamRow';
import CenteredLoader from '../base/CenteredLoader';

export default function TeamsPanel() {
  // import mui theme
  const theme = useTheme();
  const { i18n } = useTranslation();
  const { credentialsManager, user } = useLoginContext();
  const [teamsCaptainOf, setTeamsCaptainOf] = React.useState<Team[]>([]);
  const [teamsMemberOf, setTeamsMemberOf] = React.useState<Team[]>([]);
  const [isFetchLoading, setFetchLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    if (user) {
      setFetchLoading(true);
      getUserTeams(credentialsManager, user.id)
        .then((teams) => {
          setTeamsCaptainOf(
            teams.filter((team) =>
              team.members.some(
                (teamMember) =>
                  teamMember.role === 'captain' && teamMember.id === user.id
              )
            )
          );
          setTeamsMemberOf(
            teams.filter((team) =>
              team.members.some(
                (teamMember) =>
                  teamMember.role === 'member' && teamMember.id === user.id
              )
            )
          );
        })
        .catch(() =>
          toastError(
            <Typography>
              {i18n.t('components.account.teams.fetchError')}
            </Typography>
          )
        )
        .finally(() => setFetchLoading(false));
    }
  }, [credentialsManager, i18n, user]);

  // --- render ---
  return (
    <Box className={styles.container}>
      {/* title */}
      <Box className={styles.titleContainer}>
        <Typography variant="h3" color="inherit">
          {i18n.t('components.account.teams.title')}
        </Typography>
      </Box>
      {/* content container */}
      <Box className={styles.contentContainer}>
        {/* Captain of */}
        <Box className={styles.memberOf}>
          <Typography variant="h4" sx={{ color: theme.palette.primary.main }}>
            {i18n.t('components.account.teams.captainOf')}
          </Typography>
          <Stack className={styles.teamsList} spacing={4}>
            {/* While we are loading teams, we show a loader */}
            {isFetchLoading && <CenteredLoader />}
            {/* If we don't have teams, we show a message */}
            {!isFetchLoading && teamsCaptainOf.length === 0 && (
              <Typography
                className={styles.noData}
                variant="body1"
                sx={{ color: theme.palette.text.primary }}
              >
                {i18n.t('components.account.teams.notCaptainOf')}
              </Typography>
            )}
            {/* If we have teams, we show them */}
            {!isFetchLoading &&
              teamsCaptainOf.length > 0 &&
              teamsCaptainOf.map((team: Team) => (
                <TeamRow key={team.id} team={team} />
              ))}
          </Stack>
        </Box>
        {/* Member of */}
        <Box className={styles.memberOf}>
          <Typography variant="h4" sx={{ color: theme.palette.primary.main }}>
            {i18n.t('components.account.teams.memberOf')}
          </Typography>
          <Stack className={styles.teamsList} spacing={4}>
            {/* While we are loading teams, we show a loader */}
            {isFetchLoading && <CenteredLoader />}
            {/* If we don't have teams, we show a message */}
            {!isFetchLoading && teamsMemberOf.length === 0 && (
              <Typography
                className={styles.noData}
                variant="body1"
                sx={{ color: theme.palette.text.primary }}
              >
                {i18n.t('components.account.teams.notMemberOf')}
              </Typography>
            )}
            {/* If we have teams, we show them */}
            {!isFetchLoading &&
              teamsMemberOf.length > 0 &&
              teamsMemberOf.map((team: Team) => (
                <TeamRow key={team.id} team={team} showCaptainIcon />
              ))}
          </Stack>
          <Stack direction="row" spacing={2}>
            <Link href="/team">
              <Button variant="contained">
                {i18n.t('components.account.teams.seeAll')}
              </Button>
            </Link>
            <Link href="/team/create">
              <Button>{i18n.t('components.account.teams.create')}</Button>
            </Link>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}
