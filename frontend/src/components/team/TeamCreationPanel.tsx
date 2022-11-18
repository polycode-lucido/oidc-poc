import React from 'react';
import {
  Box,
  Typography,
  TextField,
  useTheme,
  Button,
  Stack,
} from '@mui/material';
import { useRouter } from 'next/router';

import { LoadingButton } from '@mui/lab';
import styles from '../../styles/components/account/Settings.module.css';
import TextInput from '../base/TextInput';
import { useTranslation } from '../../lib/translations';
import { useLoginContext } from '../../lib/loginContext';
import { createTeam, TeamRequest } from '../../lib/api/team';
import { toastError, toastSuccess } from '../base/toast/Toast';

type EditorState = {
  name: string;
  description: string;
};

type EditorErrors = {
  name: string;
  description: string;
};

const defaultEditorErrors = {
  name: '',
  description: '',
};

export default function TeamEditionPanel() {
  const defaultEditorState = {
    name: '',
    description: '',
  };

  // import mui theme
  const theme = useTheme();
  const router = useRouter();
  const { i18n } = useTranslation();
  const { credentialsManager } = useLoginContext();
  const [editorState, setEditorState] =
    React.useState<EditorState>(defaultEditorState);
  const [editorErrors, setEditorErrors] =
    React.useState<EditorErrors>(defaultEditorErrors);
  const [saveLoading, setSaveLoading] = React.useState<boolean>(false);

  // --- error checks ---
  const checkName = () => {
    if (editorState.name.length < 3) {
      setEditorErrors({
        ...editorErrors,
        name: i18n.t('components.team.teamCreationPanel.nameTooShort'),
      });
      return false;
    }
    if (editorState.name.length > 20) {
      setEditorErrors({
        ...editorErrors,
        name: i18n.t('components.team.teamCreationPanel.nameTooLong'),
      });
      return false;
    }
    setEditorErrors({
      ...editorErrors,
      name: '',
    });
    return true;
  };

  const checkDescription = () => {
    if (editorState.description.length > 500) {
      setEditorErrors({
        ...editorErrors,
        description: i18n.t(
          'components.team.teamCreationPanel.descriptionTooLong'
        ),
      });
      return false;
    }
    setEditorErrors({
      ...editorErrors,
      description: '',
    });
    return true;
  };

  const validate = () => checkName() && checkDescription();

  // --- update data ---
  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditorState({
      ...editorState,
      name: event.target.value,
    });
  };

  const handleDescriptionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setEditorState({
      ...editorState,
      description: event.target.value,
    });
  };

  const handleSave = () => {
    if (validate()) {
      setSaveLoading(true);
      setEditorErrors(defaultEditorErrors);
      createTeam(credentialsManager, editorState as TeamRequest)
        .then((team) => {
          toastSuccess(
            <Typography>
              {i18n.t('components.team.teamCreationPanel.creationSuccess')}
            </Typography>
          );
          router.push(`/team/${team.id}`);
        })
        .catch(() =>
          toastError(
            <Typography>
              {i18n.t('components.team.teamCreationPanel.creationError')}
            </Typography>
          )
        )
        .finally(() => setSaveLoading(false));
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
      <Box className={styles.titleContainer}>
        <Typography variant="h3" color={theme.palette.text.primary}>
          {i18n.t('components.team.teamCreationPanel.title')}
        </Typography>
      </Box>
      {/* content container */}
      <Box className={styles.formContainer}>
        {/* Information */}
        <Box className={styles.inputsContainer}>
          <Typography
            className={styles.subContentTitle}
            variant="h4"
            sx={{ color: theme.palette.primary.main }}
          >
            {i18n.t('components.team.teamCreationPanel.information')}
          </Typography>

          <Box className={styles.fieldContainer}>
            <Typography
              className={styles.fieldLabel}
              variant="h6"
              sx={{ color: theme.palette.primary.main }}
            >
              {i18n.t('components.team.teamCreationPanel.name')}
            </Typography>
            <Box className={styles.inputContainer}>
              <TextInput
                label={i18n.t('components.team.teamCreationPanel.name')}
                value={editorState.name}
                onChange={handleNameChange}
                error={editorErrors.name !== ''}
                helperText={editorErrors.name}
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
              {i18n.t('components.team.teamCreationPanel.description')}
            </Typography>

            {/* Bio content */}
            <Box>
              <TextField
                fullWidth
                multiline
                rows={4}
                value={editorState.description}
                onChange={handleDescriptionChange}
                error={editorErrors.description !== ''}
                helperText={editorErrors.description}
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
            loading={saveLoading}
          >
            {i18n.t('components.team.teamCreationPanel.save').toUpperCase()}
          </LoadingButton>
          <Button
            variant="outlined"
            className={styles.resetButton}
            onClick={handleReset}
          >
            {i18n.t('components.team.teamCreationPanel.reset')}
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}
