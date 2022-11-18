/* eslint-disable no-nested-ternary */
import React from 'react';
import {
  Box,
  Typography,
  TextField,
  useTheme,
  Button,
  Stack,
  SelectChangeEvent,
} from '@mui/material';
import { isEqual } from 'lodash';
import LoadingButton from '@mui/lab/LoadingButton';
import CustomSelect from '../base/Select';
import styles from '../../styles/components/account/Settings.module.css';
import TextInput from '../base/TextInput';
import { useTranslation } from '../../lib/translations';
import { useLoginContext } from '../../lib/loginContext';
import {
  createUserEmail,
  deleteUserEmail,
  getUserEmails,
  getUserSettings,
  updateUser,
  updateUserSettings,
  UserEmail,
} from '../../lib/api/user';
import { toastError, toastSuccess } from '../base/toast/Toast';
import {
  EditorLanguage,
  getLanguageNameFromEditorLanguage,
} from '../../lib/api/content';

type EditorState = {
  username: string;
  emails: UserEmail[];
  preferredEditingLanguage: EditorLanguage;
  biography: string;
};

type EditorErrors = {
  username: string;
  emails: string[];
  biography: string;
};

const defaultEditorErrors = {
  username: '',
  emails: ['', ''],
  biography: '',
};

export default function Settings() {
  // import mui theme
  const theme = useTheme();
  const { user, credentialsManager, refreshUser } = useLoginContext();
  const { i18n } = useTranslation();
  const [defaultEditorState, setDefaultEditorState] =
    React.useState<EditorState>({
      username: '',
      emails: [],
      preferredEditingLanguage: EditorLanguage.Node,
      biography: '',
    });
  const [editorState, setEditorState] =
    React.useState<EditorState>(defaultEditorState);
  const [editorErrors, setEditorErrors] =
    React.useState<EditorErrors>(defaultEditorErrors);
  const [loading, setLoading] = React.useState(false);

  // --- init data ---
  React.useEffect(() => {
    const initData = async () => {
      if (user) {
        const userEmails = await getUserEmails(credentialsManager, user.id);
        const userSettings = await getUserSettings(credentialsManager, user.id);
        const state = {
          username: user.username,
          emails: userEmails,
          preferredEditingLanguage: userSettings.preferredEditingLanguage,
          biography: user.description || '',
        };
        setDefaultEditorState(state);
        setEditorState(state);
      }
    };
    setLoading(true);
    initData()
      .catch(() =>
        toastError(
          <Typography>
            {i18n.t('components.account.settings.serverFetchFailed')}
          </Typography>
        )
      )
      .finally(() => setLoading(false));
  }, [user, credentialsManager, i18n]);

  // --- error checks ---
  const checkUsername = () => {
    if (editorState.username.length < 3) {
      setEditorErrors({
        ...editorErrors,
        username: i18n.t('components.account.settings.usernameTooShort'),
      });
      return false;
    }
    if (editorState.username.length > 20) {
      setEditorErrors({
        ...editorErrors,
        username: i18n.t('components.account.settings.usernameTooLong'),
      });
      return false;
    }
    setEditorErrors({
      ...editorErrors,
      username: '',
    });
    return true;
  };

  const checkEmails = (index: number) => {
    if (editorState.emails[index]?.email.length < 3) {
      const newEmails = [...editorErrors.emails];
      newEmails[index] = i18n.t('components.account.settings.emailTooShort');
      setEditorErrors({
        ...editorErrors,
        emails: newEmails,
      });
      return false;
    }
    if (editorState.emails[index]?.email.length > 50) {
      const newEmails = [...editorErrors.emails];
      newEmails[index] = i18n.t('components.account.settings.emailTooLong');
      setEditorErrors({
        ...editorErrors,
        emails: newEmails,
      });
      return false;
    }
    if (editorState.emails[index]?.email.indexOf('@') === -1) {
      const newEmails = [...editorErrors.emails];
      newEmails[index] = i18n.t('components.account.settings.emailInvalid');
      setEditorErrors({
        ...editorErrors,
        emails: newEmails,
      });
      return false;
    }
    const newEmails = [...editorErrors.emails];
    newEmails[index] = '';
    setEditorErrors({
      ...editorErrors,
      emails: newEmails,
    });
    return true;
  };

  const checkBiography = () => {
    if (editorState.biography.length > 500) {
      setEditorErrors({
        ...editorErrors,
        biography: i18n.t('components.account.settings.biographyTooLong'),
      });
      return false;
    }
    setEditorErrors({
      ...editorErrors,
      biography: '',
    });
    return true;
  };

  const validate = () =>
    checkUsername() && checkEmails(0) && checkEmails(1) && checkBiography();

  // --- update data ---
  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditorState({
      ...editorState,
      username: event.target.value,
    });
  };

  const handleEmailChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newEmails = [...editorState.emails];
    newEmails[index].email = event.target.value;
    setEditorState({
      ...editorState,
      emails: newEmails,
    });
  };

  const handlePreferedLanguageChange = (event: SelectChangeEvent<string>) => {
    // Making sure it's a correct enum value
    if (Object.values(EditorLanguage).find((c) => c === event.target.value)) {
      setEditorState({
        ...editorState,
        preferredEditingLanguage: event.target.value as EditorLanguage,
      });
    }
  };

  const handleBiographyChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setEditorState({
      ...editorState,
      biography: event.target.value,
    });
  };

  const handleSave = () => {
    if (validate()) {
      setEditorErrors(defaultEditorErrors);
      setLoading(true);

      if (user) {
        let primaryEmailUpdate = Promise.resolve([true, true]);
        let secondaryEmailUpdate = Promise.resolve([true, true]);

        // we can't update an email. We need to delete and recreate a new one
        if (!isEqual(editorState.emails[0], defaultEditorState.emails[0])) {
          primaryEmailUpdate = Promise.all([
            deleteUserEmail(
              credentialsManager,
              user.id,
              defaultEditorState.emails[0].id
            ),
            createUserEmail(credentialsManager, user.id, {
              email: editorState.emails[0].email,
            }),
          ]);
        }
        if (!isEqual(editorState.emails[0], defaultEditorState.emails[0])) {
          secondaryEmailUpdate = Promise.all([
            deleteUserEmail(
              credentialsManager,
              user.id,
              defaultEditorState.emails[1].id
            ),
            createUserEmail(credentialsManager, user.id, {
              email: editorState.emails[1].email,
            }),
          ]);
        }
        Promise.all([
          updateUser(credentialsManager, user.id, {
            username: editorState.username,
          }),
          updateUserSettings(credentialsManager, user.id, {
            preferredEditingLanguage: editorState.preferredEditingLanguage,
          }),
          primaryEmailUpdate,
          secondaryEmailUpdate,
        ])
          .then(() => {
            refreshUser();
            toastSuccess(
              <Typography>
                {i18n.t('components.account.settings.saveSuccess')}
              </Typography>
            );
          })
          .catch(() =>
            toastError(
              <Typography>
                {i18n.t('components.account.settings.serverSaveFailed')}
              </Typography>
            )
          )
          .finally(() => setLoading(false));
      }
    }
  };

  const handleReset = () => {
    setEditorErrors(defaultEditorErrors);
    setEditorState(defaultEditorState);
  };

  // --- render ---
  return (
    <Box className={styles.container}>
      {/* panel title */}
      <Box
        className={styles.titleContainer}
        sx={{ color: theme.palette.text.primary }}
      >
        <Typography variant="h3" color="inherit">
          {i18n.t('components.account.settings.titlePage')}
        </Typography>
      </Box>
      {/* content container */}
      <Box className={styles.formContainer}>
        {/* Information */}
        <Box>
          <Typography
            className={styles.subContentTitle}
            variant="h4"
            sx={{ color: theme.palette.primary.main }}
          >
            {i18n.t('components.account.settings.information')}
          </Typography>

          {/* Username */}
          <Box className={styles.fieldContainer}>
            <Typography
              className={styles.fieldLabel}
              variant="h6"
              sx={{ color: theme.palette.primary.main }}
            >
              {i18n.t('components.account.settings.username')}
            </Typography>
            <Box className={styles.inputContainer}>
              <TextInput
                label={i18n.t('components.account.settings.username')}
                value={editorState.username}
                onChange={handleUsernameChange}
                error={editorErrors.username !== ''}
                helperText={editorErrors.username}
              />
            </Box>
          </Box>

          {/* Email */}
          <Box className={styles.fieldContainer}>
            <Typography
              className={styles.fieldLabel}
              variant="h6"
              sx={{ color: theme.palette.primary.main }}
            >
              {i18n.t('components.account.settings.emails')}
            </Typography>
            <Box className={styles.emailsContainer}>
              <TextInput
                label={i18n.t('components.account.settings.primaryEmail')}
                value={editorState.emails[0]?.email || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleEmailChange(0, e)
                }
                error={editorErrors.emails[0] !== ''}
                helperText={editorErrors.emails[0]}
              />
              <TextInput
                label={i18n.t('components.account.settings.secondaryEmail')}
                value={editorState.emails[1]?.email || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleEmailChange(1, e)
                }
                error={editorErrors.emails[1] !== ''}
                helperText={editorErrors.emails[1]}
              />
            </Box>
          </Box>
          {/* PreferedLanguage */}
          <Box className={styles.fieldContainer}>
            <Typography
              className={styles.fieldLabel}
              variant="h6"
              sx={{ color: theme.palette.primary.main }}
            >
              {i18n.t('components.account.settings.preferedLanguage')}
            </Typography>
            <Box className={styles.inputContainer}>
              <CustomSelect
                label={i18n.t('components.account.settings.preferedLanguage')}
                items={Object.values(EditorLanguage).map((l) => ({
                  name: getLanguageNameFromEditorLanguage(l),
                  value: l,
                }))}
                value={editorState.preferredEditingLanguage}
                onChange={handlePreferedLanguageChange}
              />
            </Box>
          </Box>

          {/* Biography */}
          <Box className={styles.verticalFieldContainer}>
            <Typography
              className={styles.verticalFieldLabel}
              variant="h6"
              sx={{ color: theme.palette.primary.main }}
            >
              {i18n.t('components.account.settings.biography')}
            </Typography>

            {/* Bio content */}
            <Box>
              <TextField
                fullWidth
                multiline
                rows={4}
                value={editorState.biography}
                onChange={handleBiographyChange}
                error={editorErrors.biography !== ''}
                helperText={editorErrors.biography}
              />
            </Box>
          </Box>
        </Box>
      </Box>
      <Box className={styles.actionsContainer}>
        <Stack spacing={2} direction="row">
          <LoadingButton
            variant="contained"
            className={styles.saveButton}
            onClick={handleSave}
            loading={loading}
          >
            {i18n.t('components.account.settings.saveButton').toUpperCase()}
          </LoadingButton>
          <Button
            variant="outlined"
            className={styles.resetButton}
            onClick={handleReset}
          >
            {i18n.t('components.account.settings.resetButton')}
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}
