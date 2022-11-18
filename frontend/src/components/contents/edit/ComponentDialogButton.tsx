import React from 'react';
import { ButtonBase, Stack, Typography, useTheme } from '@mui/material';
import {
  CodeRounded as CodeIcon,
  DashboardRounded as DashboardIcon,
  SubjectRounded as SubjectIcon,
} from '@mui/icons-material';
import { ComponentType } from '../../../lib/api/content';
import { useTranslation } from '../../../lib/translations';

import styles from '../../../styles/components/contents/edit/ComponentDialogButton.module.css';

export type Props = {
  componentType: ComponentType;
  onClick: () => void;
  disabled?: boolean;
};

export default function ComponentDialogButton({
  componentType,
  onClick,
  disabled = false,
}: Props) {
  const { i18n } = useTranslation();
  const theme = useTheme();

  const getButtonContent = () => {
    switch (componentType) {
      case 'container':
        return (
          <>
            <DashboardIcon sx={{ fontSize: '4rem' }} />
            <Typography>
              {i18n.t(
                'components.contents.edit.componentDialogButton.container'
              )}
            </Typography>
          </>
        );
      case 'editor':
        return (
          <>
            <CodeIcon sx={{ fontSize: '4rem' }} />
            <Typography>
              {i18n.t('components.contents.edit.componentDialogButton.editor')}
            </Typography>
          </>
        );
      case 'markdown':
        return (
          <>
            <SubjectIcon sx={{ fontSize: '4rem' }} />
            <Typography>
              {i18n.t('components.contents.edit.componentDialogButton.markdown')}
            </Typography>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <ButtonBase
      onClick={onClick}
      disabled={disabled}
      className={styles.container}
      sx={{
        '&:hover': {
          borderColor: theme.palette.primary.main,
          '*': {
            fill: theme.palette.primary.main,
            color: theme.palette.primary.main,
          },
        },
      }}
    >
      <Stack className={styles.innerContainer} spacing={2}>
        {getButtonContent()}
      </Stack>
    </ButtonBase>
  );
}
