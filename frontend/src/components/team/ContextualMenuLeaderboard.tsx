import Link from 'next/link';
import React, { useState } from 'react';
import {
  Button,
  SelectChangeEvent,
  Skeleton,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import ForwardIcon from '@mui/icons-material/Forward';
import { useTranslation } from '../../lib/translations';
import Modal from '../base/Modal';
import CustomSelect from '../base/Select';
import { useLoginContext } from '../../lib/loginContext';
import { addTeamMember, Team } from '../../lib/api/team';
import { useGetUserTeams, User } from '../../lib/api/user';
import { toastError, toastSuccess } from '../base/toast/Toast';

type Props = {
  member?: User;
};

export default function ContextualMenuLeaderboard({ member }: Props) {
  const theme = useTheme();
  const { i18n } = useTranslation();
  const { credentialsManager, user } = useLoginContext();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [teams, setTeams] = useState<Team[]>([]);
  const [teamSelected, setTeamSelected] = useState<Team | undefined>(undefined);
  const teamFetchResponse = useGetUserTeams(credentialsManager, '@me');

  React.useEffect(() => {
    if (teamFetchResponse.data && user) {
      setTeams(
        teamFetchResponse.data.filter((team) =>
          team.members.some(
            (teamMember) =>
              teamMember.role === 'captain' && teamMember.id === user.id
          )
        )
      );
    }
    if (teamFetchResponse.error) {
      toastError(
        <Typography>
          {i18n.t('components.team.contextualMenuLeaderboard.fetchError')}
        </Typography>
      );
    }
  }, [teamFetchResponse, user, i18n]);

  const handleTeamChange = (event: SelectChangeEvent<string>) => {
    if (teams) {
      const team = teams.find((t) => t.id === event.target.value);
      setTeamSelected(team);
    }
  };

  const handleClick = () => {
    if (teamSelected && member) {
      addTeamMember(credentialsManager, teamSelected.id, {
        userId: member.id,
      })
        .then(() =>
          toastSuccess(
            <Typography>
              {i18n.t(
                'components.team.contextualMenuLeaderboard.addMemberSuccess'
              )}
            </Typography>
          )
        )
        .catch(() =>
          toastError(
            <Typography>
              {i18n.t(
                'components.team.contextualMenuLeaderboard.addMemberError'
              )}
            </Typography>
          )
        )
        .finally(() => setOpenModal(false));
    } else {
      toastError(
        <Typography>
          {i18n.t('components.team.contextualMenuLeaderboard.noTeamSelected')}
        </Typography>
      );
    }
  };

  return (
    <Stack spacing={1} direction="column" alignItems="flex-start">
      <Link href={`/account/${member?.id}`}>
        <Button>
          <Stack spacing={1} direction="row" color={theme.palette.text.primary}>
            <InfoIcon />
            <Typography variant="body1">
              {i18n.t('components.team.contextualMenuLeaderboard.info')}
            </Typography>
          </Stack>
        </Button>
      </Link>
      {user?.id !== member?.id && (
        <Button onClick={() => setOpenModal(true)}>
          <Stack spacing={1} direction="row" color={theme.palette.text.primary}>
            <ForwardIcon />
            <Typography variant="body1">
              {i18n.t('components.team.contextualMenuLeaderboard.invite')}
            </Typography>
            <Modal
              primaryButtonText={i18n.t(
                'components.team.contextualMenuLeaderboard.add'
              )}
              title={i18n.t('components.team.contextualMenuLeaderboard.title')}
              open={openModal}
              setOpen={setOpenModal}
              action={() => handleClick()}
            >
              <Typography variant="body1">
                {i18n.t(
                  'components.team.contextualMenuLeaderboard.inviteMessage'
                )}
              </Typography>
              {teams && teams.length > 0 && (
                <CustomSelect
                  label={i18n.t(
                    'components.team.contextualMenuLeaderboard.selectLabel'
                  )}
                  value={teamSelected?.id ?? ''}
                  onChange={handleTeamChange}
                  size="small"
                  minWidth={200}
                  items={teams.map((team) => ({
                    value: team.id,
                    name: team.name,
                  }))}
                />
              )}
              {teamFetchResponse.loading && (
                <Skeleton variant="text" width={200} />
              )}
              {teams && teams.length === 0 && (
                <Typography color={theme.palette.error.main} variant="body1">
                  {i18n.t('components.team.contextualMenuLeaderboard.noTeam')}
                </Typography>
              )}
            </Modal>
          </Stack>
        </Button>
      )}
    </Stack>
  );
}
