import React from 'react';
import { Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useTranslation } from '../../lib/translations';
import Modal from '../base/Modal';
import { removeTeamMember } from '../../lib/api/team';
import { toastError, toastSuccess } from '../base/toast/Toast';
import { useLoginContext } from '../../lib/loginContext';

type Props = {
  teamId: string;
  userId: string;
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
};

// Modal used to delete a member of a team
export default function ModalDeleteUser({
  teamId,
  userId,
  openModal,
  setOpenModal,
}: Props) {
  const { i18n } = useTranslation();
  const { credentialsManager } = useLoginContext();
  const router = useRouter();

  const handleClick = () => {
    removeTeamMember(credentialsManager, teamId, { userId })
      .then(() => {
        toastSuccess(
          <Typography>
            {i18n.t('components.team.modalDeleteUser.deleteSuccess')}
          </Typography>
        );
        if (router) router.reload();
      })
      .catch(() =>
        toastError(
          <Typography>
            {i18n.t('components.team.modalDeleteUser.deleteError')}
          </Typography>
        )
      );
  };

  return (
    <Modal
      primaryButtonText={i18n.t('components.team.modalDeleteUser.remove')}
      type="danger"
      title={i18n.t('components.team.modalDeleteUser.title')}
      open={openModal}
      setOpen={setOpenModal}
      action={() => handleClick()}
    >
      <Typography variant="body1">
        {i18n.t('components.team.modalDeleteUser.message')}
      </Typography>
      <Typography variant="body1">
        {i18n.t('components.team.modalDeleteUser.actionUndone')}
      </Typography>
    </Modal>
  );
}
