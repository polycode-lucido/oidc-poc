import React from 'react';
import {
  Stack,
  Box,
  useTheme,
  Typography,
  Button,
  Skeleton,
} from '@mui/material';
import Link from 'next/link';
import { useTranslation } from '../../lib/translations';
import styles from '../../styles/components/account/Menu.module.css';
import stylesTeam from '../../styles/components/team/Menu.module.css';
import MenuRow from './MenuRow';
import { Team } from '../../lib/api/team';
import ButtonModalDelete from './ButtonModalDelete';
import ButtonModalLeave from './ButtonModalLeave';
import { useLoginContext } from '../../lib/loginContext';

type Props = {
  team?: Team;
  state?: 'editor' | 'view';
};

export default function Menu({ team, state }: Props) {
  const theme = useTheme();
  const { i18n } = useTranslation();
  const { user } = useLoginContext();
  const isCaptain = React.useCallback(
    () =>
      user &&
      team &&
      team.members.some(
        (member) => member.id === user.id && member.role === 'captain'
      ),
    [user, team]
  );

  return (
    <Box className={styles.container}>
      <Box className={stylesTeam.innerContainer}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography
            variant="h3"
            justifyContent="center"
            display="flex"
            alignItems="center"
            sx={{ color: theme.palette.primary.main, width: '100%' }}
          >
            {team?.name ?? <Skeleton width={200} />}
          </Typography>
          <Box
            className={stylesTeam.descriptionContainer}
            height={{ xs: '6rem', sm: '6rem', md: '9rem' }}
          >
            {state === 'view' && (
              <Typography variant="body1" overflow="hidden">
                {team?.description ?? (
                  <>
                    <Skeleton width={250} />
                    <Skeleton width={250} />
                  </>
                )}
              </Typography>
            )}
          </Box>
        </Box>
        <Box
          sx={{ color: theme.palette.text.primary }}
          className={styles.navigationButtons}
        >
          <Stack
            direction="column"
            spacing={3}
            sx={{ color: theme.palette.primary.main }}
          >
            <MenuRow
              label={i18n.t('components.team.menu.polypoints')}
              value={team?.points?.toString() ?? '0'}
              isLoading={!team}
              image="/images/carrot.png"
            />
            <MenuRow
              label={i18n.t('components.team.menu.rank')}
              value={
                team?.rank?.toString() ??
                i18n.t('components.team.menu.unknownRank')
              }
              isLoading={!team}
              image="/images/rank.png"
            />
            <MenuRow
              label={i18n.t('components.team.menu.members')}
              value={team?.members?.length?.toString() ?? ''}
              isLoading={!team}
            />
          </Stack>
        </Box>
        {state === 'view' && (
          <Box className={stylesTeam.buttonContainer}>
            <Stack direction="column" spacing={2}>
              {isCaptain() && (
                <>
                  <Link href={`/team/edit/${team?.id}`}>
                    <Button variant="contained" className={stylesTeam.button}>
                      {i18n.t('components.team.menu.edit')}
                    </Button>
                  </Link>
                  <ButtonModalDelete teamId={team?.id ?? ''} />
                </>
              )}
              {!isCaptain() && (
                <ButtonModalLeave
                  userId={user?.id ?? ''}
                  teamId={team?.id ?? ''}
                />
              )}
            </Stack>
          </Box>
        )}
      </Box>
    </Box>
  );
}

Menu.defaultProps = {
  state: 'view',
};
