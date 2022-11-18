import React from 'react';
import {
  Modal as ModalMUI,
  Stack,
  Box,
  Typography,
  Button,
  useTheme,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import styles from '../../styles/components/account/Settings.module.css';
import { useTranslation } from '../../lib/translations';

type Props = {
  children: React.ReactNode;
  title: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  action?: () => void;
  type?: 'primary' | 'danger';
  primaryButtonText: string;
};

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: '5px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  p: 4,
  gap: '20px',
  textAlign: 'center',
};

export default function Modal({
  children,
  title,
  open = false,
  setOpen,
  action,
  type = 'primary',
  primaryButtonText,
}: Props) {
  const handleClose = () => setOpen(false);

  const { i18n } = useTranslation();
  const theme = useTheme();
  const handleClick = () => {
    if (action) {
      action();
    }
    handleClose();
  };

  return (
    <ModalMUI
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <IconButton
          onClick={handleClose}
          sx={{ position: 'absolute', top: 10, right: 10 }}
        >
          <CloseIcon />
        </IconButton>
        <Typography variant="h3">{title}</Typography>
        {children}
        <Stack direction="row" spacing={4}>
          <Button
            onClick={handleClose}
            variant="outlined"
            className={styles.resetButton}
            // onClick={handleReset}
          >
            {i18n.t('components.base.modal.cancel')}
          </Button>
          <Button
            variant="contained"
            onClick={handleClick}
            sx={{
              backgroundColor:
                type === 'primary'
                  ? theme.palette.primary.main
                  : theme.palette.error.main,
              '&:hover': {
                backgroundColor:
                  type === 'primary'
                    ? theme.palette.primary.dark
                    : theme.palette.error.dark,
              },
            }}
            className={styles.saveButton}
            // onClick={handleSave}
          >
            {primaryButtonText}
          </Button>
        </Stack>
      </Box>
    </ModalMUI>
  );
}
