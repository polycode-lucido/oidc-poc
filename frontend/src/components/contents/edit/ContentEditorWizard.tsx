import { Box, FormGroup, Stack, TextField, Typography } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import React from 'react';
import { ContainerComponent, Content } from '../../../lib/api/content';
import { useTranslation } from '../../../lib/translations';
import ContainerEditor from './ContainerEditor';

import styles from '../../../styles/components/contents/edit/ContentEditorWizard.module.css';
import CenteredLoader from '../../base/CenteredLoader';

type EditorErrors = {
  name: string;
  description: string;
};

export type Props = {
  content: Content;
  onChange: (content: Content) => void;
  onSave: () => void;
  isSaving: boolean;
  isLoading: boolean;
  titleText: string;
};

export default function ContentEditorWizard({
  content,
  onChange,
  onSave,
  isSaving,
  isLoading,
  titleText,
}: Props) {
  const { i18n } = useTranslation();
  const [editorErrors, setEditorErrors] = React.useState<EditorErrors>({
    name: '',
    description: '',
  });

  // --- checks ---

  const checkName = () => {
    if (content.name.length === 0) {
      setEditorErrors({
        ...editorErrors,
        name: i18n.t(
          'components.contents.edit.contentEditorWizard.errors.nameEmpty'
        ),
      });
      return false;
    }
    if (content.name.length > 50) {
      setEditorErrors({
        ...editorErrors,
        name: i18n.t(
          'components.contents.edit.contentEditorWizard.errors.nameTooLong'
        ),
      });
      return false;
    }
    return true;
  };

  const checkDescription = () => {
    if (content.description.length === 0) {
      setEditorErrors({
        ...editorErrors,
        description: i18n.t(
          'components.contents.edit.contentEditorWizard.errors.descriptionEmpty'
        ),
      });
      return false;
    }
    if (content.description.length > 500) {
      setEditorErrors({
        ...editorErrors,
        description: i18n.t(
          'components.contents.edit.contentEditorWizard.errors.descriptionTooLong'
        ),
      });
      return false;
    }
    return true;
  };

  // --- handlers ---

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...content, name: event.target.value });
  };

  const handleDescriptionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    onChange({ ...content, description: event.target.value });
  };

  const handleRewardChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = parseInt(event.target.value, 10);
    if (value < 0) {
      value = 0;
    }
    onChange({ ...content, reward: value });
  };

  const handleRootComponentChange = (component: ContainerComponent) => {
    onChange({ ...content, rootComponent: component });
  };

  const handleSave = () => {
    if (checkName() && checkDescription()) {
      setEditorErrors({ name: '', description: '' });
      onSave();
    }
  };

  // --- render ---

  return (
    <Box className={styles.container}>
      <Stack direction="column" className={styles.innerContainer} spacing={4}>
        <Typography
          variant="h3"
          component="span"
          color="text.primary"
          className={styles.title}
        >
          {titleText}
        </Typography>
        {isLoading ? (
          <CenteredLoader />
        ) : (
          <Stack direction="column" spacing={8}>
            <FormGroup>
              <Stack direction="column" spacing={2}>
                <Stack direction="row" spacing={4} className={styles.formRow}>
                  <TextField
                    value={content.name}
                    onChange={handleNameChange}
                    label={i18n.t(
                      'components.contents.edit.contentEditorWizard.name'
                    )}
                    variant="standard"
                    className={styles.littleTextField}
                    error={editorErrors.name.length > 0}
                    helperText={editorErrors.name}
                    required
                  />
                  <TextField
                    value={content.reward}
                    onChange={handleRewardChange}
                    label={i18n.t(
                      'components.contents.edit.contentEditorWizard.reward'
                    )}
                    type="number"
                    variant="standard"
                    className={styles.littleTextField}
                  />
                </Stack>
                <TextField
                  multiline
                  value={content.description}
                  onChange={handleDescriptionChange}
                  label={i18n.t(
                    'components.contents.edit.contentEditorWizard.description'
                  )}
                  variant="standard"
                  error={editorErrors.description.length > 0}
                  helperText={editorErrors.description}
                  required
                />
              </Stack>
            </FormGroup>
            <ContainerEditor
              container={content.rootComponent}
              onChange={handleRootComponentChange}
              currentDepth={0}
              removeButton={null}
            />
            <LoadingButton
              onClick={() => handleSave()}
              variant="contained"
              loading={isSaving}
              className={styles.saveButton}
            >
              {i18n.t('components.contents.edit.contentEditorWizard.save')}
            </LoadingButton>
          </Stack>
        )}
      </Stack>
    </Box>
  );
}
