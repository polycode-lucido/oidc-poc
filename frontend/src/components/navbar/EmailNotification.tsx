import {
  IconButton,
  Box,
  Badge,
  Modal,
  Typography,
  Button,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import React, { useEffect, useState } from 'react';
import { getUserEmails, resendEmail, UserEmail } from '../../lib/api/user';
import { useLoginContext } from '../../lib/loginContext';
import { format, useTranslation } from '../../lib/translations';
import { toastError, toastSuccess } from '../base/toast/Toast';

import styles from '../../styles/components/navbar/EmailNotification.module.css';

export default function EmailNotification() {
  const { user, credentialsManager } = useLoginContext();
  const { i18n } = useTranslation();

  const [emails, setEmails] = useState<UserEmail[]>([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (user)
      getUserEmails(credentialsManager, user.id)
        .then((v) => setEmails(v))
        // not important so no error displayed
        .catch(() => {});
  }, [credentialsManager, user]);

  // don’t show if no email or no user

  if (!user) return null;
  if (emails.length === 0) return null;

  // don’t show if verified
  const email = emails[0];
  if (email.isVerified) return null;

  const handleResendEmail = () => {
    resendEmail(email.id)
      .then(() => {
        toastSuccess(
          <Typography>
            {i18n.t('components.navbar.emailNotification.resendSuccess')}
          </Typography>
        );
      })
      .catch(() => {
        toastError(
          <Typography>
            {i18n.t('components.navbar.emailNotification.resendError')}
          </Typography>
        );
      });
  };

  return (
    <>
      <Modal open={showModal} onClose={() => setShowModal(false)}>
        <Box
          sx={{
            bgcolor: 'background.paper',
          }}
          className={styles.modal}
        >
          <Typography variant="h6" component="h2">
            {i18n.t('components.navbar.emailNotification.title')}
          </Typography>
          <Typography sx={{ mt: 2 }}>
            {format(
              i18n.t('components.navbar.emailNotification.sentMail'),
              '{0}',
              email.email
            )}
          </Typography>
          <Typography className={styles.question}>
            {i18n.t('components.navbar.emailNotification.didNotReceive')}
          </Typography>
          <Button
            className={styles.resend}
            variant="contained"
            onClick={handleResendEmail}
          >
            {i18n.t('components.navbar.emailNotification.resend')}
          </Button>
        </Box>
      </Modal>
      <Box />
      <IconButton className={styles.button} onClick={() => setShowModal(true)}>
        <Badge color="error" variant="dot">
          <EmailIcon color="primary" />
        </Badge>
      </IconButton>
    </>
  );
}
