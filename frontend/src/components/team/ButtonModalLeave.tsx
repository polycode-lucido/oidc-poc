import React, { useState } from 'react';
import { Button, Typography } from '@mui/material';
import { useTranslation } from '../../lib/translations';
import Modal from '../base/Modal';
import stylesTeam from '../../styles/components/team/Menu.module.css';
import { removeTeamMember } from '../../lib/api/team';
import { useLoginContext } from '../../lib/loginContext';
import { toastError, toastSuccess } from '../base/toast/Toast';

type Props = {
  teamId: string;
  userId: string;
};

export default function ButtonModalLeave({ userId, teamId }: Props) {
  const { i18n } = useTranslation();
  const { credentialsManager } = useLoginContext();
  const [openModal, setOpenModal] = useState<boolean>(false);

  const handleClick = () => {
    removeTeamMember(credentialsManager, teamId, { userId })
      .then(() =>
        toastSuccess(
          <Typography>
            {i18n.t('components.team.buttonModalLeave.leaveSuccess')}
          </Typography>
        )
      )
      .catch(() =>
        toastError(
          <Typography>
            {i18n.t('components.team.buttonModalLeave.leaveError')}
          </Typography>
        )
      );
  };

  return (
    <>
      <Button
        variant="outlined"
        className={stylesTeam.button}
        onClick={() => setOpenModal(!openModal)}
      >
        {i18n.t('components.team.buttonModalLeave.leave')}
      </Button>
      <Modal
        primaryButtonText={i18n.t('components.team.buttonModalLeave.leave')}
        type="danger"
        title={i18n.t('components.team.buttonModalLeave.title')}
        open={openModal}
        setOpen={setOpenModal}
        action={() => handleClick()}
      >
        <Typography variant="body1">
          {i18n.t('components.team.buttonModalLeave.message')}
        </Typography>
      </Modal>
    </>
  );
}
