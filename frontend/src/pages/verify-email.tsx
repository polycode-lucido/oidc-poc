import React from 'react';
import { Typography, Button, Box, CircularProgress } from '@mui/material';
import { useRouter } from 'next/router';

import { resendEmail } from '../lib/api/user';
import { useTranslation } from '../lib/translations';
import { useLoginContext } from '../lib/loginContext';
import { toastSuccess, toastError } from '../components/base/toast/Toast';

import styles from '../styles/components/email/MailMessage.module.css';

export default function MailMessage() {
  const { i18n } = useTranslation();
  const { emails } = useLoginContext();
  const router = useRouter();

  if (emails === null) {
    router.push('/');

    return null;
  }

  if (typeof emails === 'undefined') return <CircularProgress />;

  const email = emails[0];

  if (email.isVerified) router.push('/');

  const handleResendEmail = () => {
    resendEmail(email.id)
      .then(() => {
        toastSuccess(
          <Typography>{i18n.t('components.email.resendSuccess')}</Typography>
        );
      })
      .catch(() => {
        toastError(
          <Typography>{i18n.t('components.email.resendError')}</Typography>
        );
      });
  };

  return (
    <Box className={styles.container}>
      <Typography variant="h6" component="h2">
        {i18n.t('components.email.title')}
      </Typography>
      <Typography sx={{ mt: 2 }}>
        {i18n.t('components.email.sentMail')} {email.email}{' '}
        {i18n.t('components.email.sentMailSuite')}
      </Typography>
      <Typography className={styles.question}>
        {i18n.t('components.email.didNotReceive')}
      </Typography>
      <Button
        className={styles.resend}
        variant="contained"
        onClick={handleResendEmail}
      >
        {i18n.t('components.email.resend')}
      </Button>
    </Box>
  );
}
