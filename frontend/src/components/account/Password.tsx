import React, { ChangeEvent, useState, useEffect } from 'react';
import { Box, Typography, Stack, Button, useTheme } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { toast } from 'react-toastify';
import { useTranslation } from '../../lib/translations';

import styles from '../../styles/components/account/Password.module.css';
import TextInput from '../base/TextInput';

export default function Password() {
  const { i18n } = useTranslation();

  // import mui theme
  const theme = useTheme();

  // forms state
  const [formState, setFormState] = useState({
    oldPassword: '',
    password: '',
    confirmPassword: '',
  });

  // store form errors related to each input here
  const [formErrorsState, setFormErrorsState] = useState({
    password: '',
    confirmPassword: '',
  });

  // formErrorsState handlers

  const checkPassword = () => {
    // password rules
    if (formState.password.length > 0 && formState.password.length < 8) {
      if (formErrorsState.password.length === 0) {
        setFormErrorsState((previous) => ({
          ...previous,
          password: i18n.t(
            'components.account.password.passwordRulesNotRespected'
          ),
        }));
      }
    } else {
      setFormErrorsState((previous) => ({ ...previous, password: '' }));
    }
  };

  const checkConfirmPassword = () => {
    if (
      formState.password.length > 0 &&
      formState.confirmPassword.length > 0 &&
      formState.confirmPassword !== formState.password
    ) {
      if (formErrorsState.confirmPassword.length === 0) {
        setFormErrorsState((previous) => ({
          ...previous,
          confirmPassword: i18n.t(
            'components.account.password.passwordsMismatch'
          ),
        }));
      }
    } else {
      setFormErrorsState((previous) => ({ ...previous, confirmPassword: '' }));
    }
  };

  // checks on state change
  useEffect(checkPassword, [
    formState.password,
    formErrorsState.password.length,
    i18n,
  ]);

  useEffect(checkConfirmPassword, [
    formState.password,
    formState.confirmPassword,
    formErrorsState.confirmPassword.length,
    i18n,
  ]);

  // progress indicator
  const [loading, setLoading] = useState(false);

  // --- Event handlers ---

  const handleOldPasswordChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormState({ ...formState, oldPassword: event.target.value });
  };

  const handlePasswordChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormState({ ...formState, password: event.target.value });
  };

  const handlePasswordConfirmationChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormState({ ...formState, confirmPassword: event.target.value });
  };

  // --- Button Events handlers ---

  // TODO
  const handleSave = () => {
    // check availability to save
    if (
      formState.password === '' ||
      formState.confirmPassword === '' ||
      formState.oldPassword === ''
    ) {
      toast.error(i18n.t('components.account.password.someFieldsEmpty'));
    }

    if (
      !formState.password ||
      !formState.confirmPassword ||
      !formState.oldPassword ||
      formErrorsState.password ||
      formErrorsState.confirmPassword
    ) {
      return;
    }

    setLoading(true);

    const apiCall = new Promise<string>((resolve) => {
      console.warn('Faking request to backend');

      setTimeout(() => {
        resolve('Update successfuly');
      }, 1000);
    });

    // handle error
    apiCall.catch((reason) => {
      // TODO : use notification

      console.error(reason);
    });

    apiCall.finally(() => {
      setLoading(false);
    });
  };

  const handleCancel = () => {
    if (!loading) {
      setFormState({ oldPassword: '', password: '', confirmPassword: '' });
    }
  };

  return (
    <Box className={styles.container}>
      {/* window title */}
      <Box
        className={styles.titleContainer}
        sx={{ color: theme.palette.text.primary }}
      >
        <Typography variant="h3">
          {i18n.t('components.account.password.titlePage')}
        </Typography>
      </Box>
      {/* content container */}
      <Box className={styles.formContainer}>
        {/* old password */}
        <Box className={styles.formSection}>
          <Typography
            variant="h4"
            className={styles.oldPasswordLabel}
            sx={{ color: theme.palette.primary.main }}
          >
            {i18n.t('components.account.password.oldPassword')}
          </Typography>

          <Box className={styles.inputContainer}>
            <TextInput
              onChange={handleOldPasswordChange}
              type="password"
              label={i18n.t('components.account.password.passwordLabel')}
              value={formState.oldPassword}
            />
          </Box>
        </Box>
        {/* new passwords */}
        <Box className={styles.formSection}>
          <Typography
            variant="h4"
            className={styles.newPasswordLabel}
            sx={{ color: theme.palette.primary.main }}
          >
            {i18n.t('components.account.password.newPassword')}
          </Typography>

          <Box className={styles.inputContainer}>
            <Stack spacing={4} className={styles.fieldForm}>
              <TextInput
                type="password"
                onChange={handlePasswordChange}
                label={i18n.t('components.account.password.passwordLabel')}
                value={formState.password}
                error={formErrorsState.password.length > 0}
                helperText={formErrorsState.password}
              />

              <TextInput
                type="password"
                onChange={handlePasswordConfirmationChange}
                label={i18n.t(
                  'components.account.password.passwordConfirmationLabel'
                )}
                value={formState.confirmPassword}
                error={formErrorsState.confirmPassword.length > 0}
                helperText={formErrorsState.confirmPassword}
              />
            </Stack>
          </Box>
        </Box>
        {/* buttons */}
      </Box>
      <Box className={styles.actionsContainer}>
        <Stack direction="row" spacing={2} className={styles.buttonsStack}>
          <LoadingButton
            variant="contained"
            className={styles.saveButton}
            onClick={handleSave}
            loading={loading}
          >
            {i18n.t('components.account.password.saveButton').toUpperCase()}
          </LoadingButton>
          <Button
            variant="outlined"
            className={styles.resetButton}
            onClick={handleCancel}
          >
            {i18n.t('components.account.password.resetButton')}
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}
