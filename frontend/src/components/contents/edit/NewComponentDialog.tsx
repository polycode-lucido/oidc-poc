import React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
} from '@mui/material';
import { ComponentType } from '../../../lib/api/content';
import { useTranslation } from '../../../lib/translations';
import ComponentDialogButton from './ComponentDialogButton';

import styles from '../../../styles/components/contents/edit/NewComponentDialog.module.css';

export type Props = {
  isOpen: boolean;
  onChoose: (componentType?: ComponentType) => void;
  disableContainer?: boolean;
};

export default function NewComponentDialog({
  isOpen,
  onChoose,
  disableContainer = false,
}: Props) {
  const { i18n } = useTranslation();

  return (
    <Dialog open={isOpen}>
      <DialogTitle>
        {i18n.t('components.contents.edit.newComponentDialog.title')}
      </DialogTitle>
      <DialogContent className={styles.container}>
        <Stack direction="column" spacing={4} className={styles.column}>
          <Stack direction="row" spacing={4} className={styles.row}>
            <ComponentDialogButton
              componentType="container"
              onClick={() => onChoose('container')}
              disabled={disableContainer}
            />
            <ComponentDialogButton
              componentType="markdown"
              onClick={() => onChoose('markdown')}
            />
          </Stack>
          <Stack direction="row" spacing={4} className={styles.row}>
            <ComponentDialogButton
              componentType="editor"
              onClick={() => onChoose('editor')}
            />
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onChoose(undefined)}>
          {i18n.t('components.contents.edit.newComponentDialog.cancel')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
