/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  useTheme,
  Button,
  Stack,
} from '@mui/material';

import { LoadingButton } from '@mui/lab';
import { useRouter } from 'next/router';
import styles from '../../styles/components/account/Settings.module.css';
import TextInput from '../base/TextInput';
import { useTranslation } from '../../lib/translations';
import { Team, TeamRequest, updateTeam } from '../../lib/api/team';
import { useLoginContext } from '../../lib/loginContext';
import { toastError, toastSuccess } from '../base/toast/Toast';
import UserRow from '../base/UserRow';

type EditorState = {
  name: string;
  description: string;
};

const defaultEditorState = {
  name: '',
  description: '',
};

type Props = {
  team?: Team;
};

export default function TeamEditionPanel({ team }: Props) {
  // import mui theme
  const theme = useTheme();
  const router = useRouter();
  const { i18n } = useTranslation();
  const { credentialsManager } = useLoginContext();
  const [editorState, setEditorState] =
    useState<EditorState>(defaultEditorState);
  const [editorErrors, setEditorErrors] =
    useState<EditorState>(defaultEditorState);
  const [saveLoading, setSaveLoading] = useState<boolean>(false);

  useEffect(() => {
    if (team) {
      setEditorState({ name: team.name, description: team.description });
    }
  }, [team]);

  // --- error checks ---
  const checkName = () => {
    if (editorState.name.length < 3) {
      setEditorErrors({
        ...editorErrors,
        name: i18n.t('components.team.teamEditionPanel.nameTooShort'),
      });
      return false;
    }
    if (editorState.name.length > 20) {
      setEditorErrors({
        ...editorErrors,
        name: i18n.t('components.team.teamEditionPanel.nameTooLong'),
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
          'components.team.teamEditionPanel.descriptionTooLong'
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
    if (validate() && team) {
      setSaveLoading(true);
      setEditorErrors(defaultEditorState);
      updateTeam(credentialsManager, team.id, editorState as TeamRequest)
        .then(() => {
          toastSuccess(
            <Typography>
              {i18n.t('components.team.teamEditionPanel.saveSuccess')}
            </Typography>
          );
          if (router) router.push(`/team/${team.id}`);
        })
        .catch(() =>
          toastError(
            <Typography>
              {i18n.t('components.team.teamEditionPanel.saveError')}
            </Typography>
          )
        )
        .finally(() => setSaveLoading(false));
    }
  };

  const handleReset = () => {
    setEditorErrors(defaultEditorState);
    setEditorState(team ? (team as EditorState) : defaultEditorState);
  };

  // --- render ---²
  return (
    <Box className={styles.container}>
      {/* panel title */}
      <Box className={styles.titleContainer}>
        <Typography variant="h3" color={theme.palette.text.primary}>
          {i18n.t('components.team.teamEditionPanel.title')}
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
            {i18n.t('components.team.teamEditionPanel.information')}
          </Typography>

          <Box className={styles.fieldContainer}>
            <Typography
              className={styles.fieldLabel}
              variant="h6"
              sx={{ color: theme.palette.primary.main }}
            >
              {i18n.t('components.team.teamEditionPanel.contentName')}
            </Typography>
            <Box className={styles.inputContainer}>
              <TextInput
                label={i18n.t('components.team.teamEditionPanel.contentName')}
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
              {i18n.t('components.team.teamEditionPanel.contentDescription')}
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
          <Stack direction="column" spacing={4} sx={{ mt: 6 }}>
            <>
              <Typography
                className={styles.subContentTitle}
                variant="h4"
                sx={{ color: theme.palette.primary.main }}
              >
                {i18n.t('components.team.teamEditionPanel.contentMembers')}
              </Typography>
              {(team?.members?.length ?? 0) > 0 &&
                team?.members?.map((member) => (
                  <UserRow key={member.id} user={member} />
                ))}
            </>
          </Stack>
        </Box>
      </Box>
      <Box className={styles.actionsContainer}>
        <Stack spacing={2} direction="row">
          <LoadingButton
            variant="contained"
            className={styles.saveButton}
            onClick={handleSave}
            loading={saveLoading || !team}
          >
            {i18n
              .t('components.team.teamEditionPanel.saveButton')
              .toUpperCase()}
          </LoadingButton>
          <Button
            variant="outlined"
            className={styles.resetButton}
            onClick={handleReset}
          >
            {i18n.t('components.team.teamEditionPanel.resetButton')}
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}
