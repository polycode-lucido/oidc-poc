import React from 'react';
import { Box, useTheme, Typography, Stack } from '@mui/material';
import { Team } from '../../lib/api/team';
import { useTranslation } from '../../lib/translations';
import styles from '../../styles/components/team/TeamMembersPanel.module.css';
import UserRow from '../base/UserRow';
import ContextualMenuAdmin from './ContextualMenuAdmin';
import ContextualMenuUser from './ContextualMenuUser';
import { useLoginContext } from '../../lib/loginContext';
import CenteredLoader from '../base/CenteredLoader';

type Props = {
  team?: Team;
};

export default function TeamMembersPanel({ team }: Props) {
  const { i18n } = useTranslation();
  const theme = useTheme();
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
      {/* panel title */}
      <Typography variant="h3" color={theme.palette.text.primary}>
        {i18n.t('components.team.teamPanel.members')}
      </Typography>
      <Stack direction="column" spacing={4} sx={{ mt: 6 }}>
        {team ? (
          team.members
            .sort((m1, m2) => m2.points - m1.points)
            .map((member, index) => (
              <UserRow
                key={member.id}
                user={member}
                rank={index + 1}
                contextualMenuContent={
                  team && isCaptain() ? (
                    <ContextualMenuAdmin team={team} user={member} />
                  ) : (
                    <ContextualMenuUser userId={member.id} />
                  )
                }
              />
            ))
        ) : (
          <CenteredLoader />
        )}
      </Stack>
    </Box>
  );
}
