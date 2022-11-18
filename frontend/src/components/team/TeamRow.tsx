import {
  ButtonBase,
  Divider,
  Skeleton,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import { useRouter } from 'next/router';
import { LocalPolice } from '@mui/icons-material';
import React from 'react';
import calcTeamPoints, { Team } from '../../lib/api/team';

import styles from '../../styles/components/team/TeamRow.module.css';
import Polypoints from '../Polypoints';

type Props = {
  team?: Team;
  showCaptainIcon?: boolean;
};

// Retrieve if the user is connected and show an icon if he is the captain

export default function TeamRowGeneric({ team, showCaptainIcon }: Props) {
  const theme = useTheme();
  const router = useRouter();

  const handleClick = () => {
    if (router && team) router.push(`/team/${team.id}`);
  };

  return (
    <ButtonBase
      onClick={handleClick}
      className={styles.container}
      style={{ borderColor: theme.palette.primary.main }}
    >
      <Stack className={styles.innerContainer} direction="row">
        <Stack direction="row" className={styles.leftSideContainer} spacing={2}>
          {team ? (
            <Typography sx={{ color: theme.palette.text.primary }}>
              {team.name}
            </Typography>
          ) : (
            <Skeleton width={150} />
          )}
          {showCaptainIcon && (
            <>
              <Divider orientation="vertical" flexItem />
              <Stack direction="row" className={styles.captain} spacing={2}>
                <LocalPolice sx={{ fill: theme.palette.primary.main }} />
                <Typography>
                  {team?.members.find((member) => member.role === 'captain')
                    ?.username ?? <Skeleton width={100} />}
                </Typography>
              </Stack>
            </>
          )}
        </Stack>
        {team ? (
          <Polypoints points={calcTeamPoints(team)} />
        ) : (
          <Skeleton width={50} />
        )}
      </Stack>
    </ButtonBase>
  );
}
