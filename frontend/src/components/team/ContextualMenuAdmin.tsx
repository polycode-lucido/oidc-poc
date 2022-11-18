import React, { useState } from 'react';
import Link from 'next/link';
import { Button, Stack, Typography, useTheme } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTranslation } from '../../lib/translations';
import { TeamMember, Team } from '../../lib/api/team';
import { useLoginContext } from '../../lib/loginContext';
import ModalRemoveUser from './ModalRemoveUser';

type Props = {
  team: Team;
  user: TeamMember;
};

export default function ContextualMenuAdmin({ team, user }: Props) {
  const theme = useTheme();
  const { i18n } = useTranslation();
  const loginContext = useLoginContext();

  const [openModal, setOpenModal] = useState<boolean>(false);

  return (
    <Stack spacing={1} direction="column" alignItems="flex-start">
      <Link
        href={
          loginContext.user?.id === user.id
            ? '/account/profile'
            : `/account/${user.id}`
        }
      >
        <Button>
          <Stack spacing={1} direction="row" color={theme.palette.text.primary}>
            <InfoIcon />
            <Typography variant="body1">
              {i18n.t('components.team.contextualMenu.info')}
            </Typography>
          </Stack>
        </Button>
      </Link>
      {loginContext.user?.id !== user.id && (
        <Button onClick={() => setOpenModal(true)}>
          <Stack spacing={1} direction="row" color={theme.palette.error.main}>
            <DeleteIcon />
            <Typography variant="body1">
              {i18n.t('components.team.contextualMenu.remove')}
            </Typography>
          </Stack>
        </Button>
      )}
      <ModalRemoveUser
        teamId={team.id}
        userId={user.id}
        setOpenModal={setOpenModal}
        openModal={openModal}
      />
    </Stack>
  );
}
