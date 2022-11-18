import React from 'react';
import { Button, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useTranslation } from '../../lib/translations';
import Modal from '../base/Modal';
import stylesTeam from '../../styles/components/team/Menu.module.css';
import { deleteTeam } from '../../lib/api/team';
import { useLoginContext } from '../../lib/loginContext';
import { toastError, toastSuccess } from '../base/toast/Toast';

type Props = {
  teamId: string;
};

export default function ButtonModalDelete({ teamId }: Props) {
  const { i18n } = useTranslation();
  const { credentialsManager } = useLoginContext();
  const router = useRouter();
  const [openModal, setOpenModal] = React.useState<boolean>(false);

  const handleClick = () => {
    deleteTeam(credentialsManager, teamId)
      .then(() => {
        toastSuccess(
          <Typography>
            {i18n.t('components.team.buttonModalDelete.deleteSuccess')}
          </Typography>
        );
        if (router) router.push('/account/teams');
      })
      .catch(() =>
        toastError(
          <Typography>
            {i18n.t('components.team.buttonModalDelete.deleteError')}
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
        {i18n.t('components.team.buttonModalDelete.delete')}
      </Button>
      <Modal
        primaryButtonText={i18n.t('components.team.buttonModalDelete.delete')}
        type="danger"
        title={i18n.t('components.team.buttonModalDelete.title')}
        open={openModal}
        setOpen={setOpenModal}
        action={() => handleClick()}
      >
        <Typography variant="body1">
          {i18n.t('components.team.buttonModalDelete.message')}
        </Typography>
        <Typography variant="body1">
          {i18n.t('components.team.buttonModalDelete.promoteInstead')}
        </Typography>
        <Typography variant="body1">
          {i18n.t('components.team.buttonModalDelete.actionUndone')}
        </Typography>
      </Modal>
    </>
  );
}
