// import { PlayArrow } from '@mui/icons-material';
import React, { useCallback } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  IconButton,
  SelectChangeEvent,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import PublishIcon from '@mui/icons-material/Publish';
import ReplayIcon from '@mui/icons-material/Replay';
import CustomSelect from '../base/Select';
import { useEditorContext } from './CodeEditorContext';

import styles from '../../styles/components/playground/Toolbar.module.css';
import { useTranslation } from '../../lib/translations';
import {
  EditorLanguage,
  getLanguageNameFromEditorLanguage,
} from '../../lib/api/content';
import { submitCode } from '../../lib/api/playground';
import { useLoginContext } from '../../lib/loginContext';
import { toastError, toastSuccess, toastWarning } from '../base/toast/Toast';

export default function Toolbar() {
  const { i18n } = useTranslation();
  const router = useRouter();

  // get content id
  const { id } = router.query;
  const contentId: string = typeof id === 'string' ? id : '';

  const { credentialsManager } = useLoginContext();
  const context = useEditorContext();

  const [loading, setLoading] = React.useState(false);

  const handleChangeLanguage = useCallback(
    (evt: SelectChangeEvent<string>) => {
      if (Object.values(EditorLanguage).find((c) => c === evt.target.value)) {
        context.setLanguage(evt.target.value as EditorLanguage);
      }
    },
    [context]
  );

  const handleSubmit = () => {
    setLoading(true);

    submitCode(
      contentId,
      context.componentId,
      context.code,
      context.language,
      credentialsManager
    )
      .then((data) => {
        if (data.success) {
          toastSuccess(
            <Typography>
              {i18n.t('components.playground.toolbar.submitSuccess')}
            </Typography>
          );
        } else {
          toastWarning(
            <Typography>
              {data.validators.filter((v) => v.success).length}/
              {data.validators.length}{' '}
              {i18n.t('components.playground.toolbar.testsPassed')}
            </Typography>
          );
        }
      })
      .catch(() => {
        toastError(
          <Typography>
            {i18n.t('components.playground.toolbar.submitError')}
          </Typography>
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Box className={styles.container}>
      <CustomSelect
        label="language"
        value={context.language}
        onChange={handleChangeLanguage}
        items={context.availableLanguages.map((l) => ({
          name: getLanguageNameFromEditorLanguage(l),
          value: l,
        }))}
        size="small"
      />

      <Box flexGrow={1} />

      <Stack spacing={1} direction="row">
        <Tooltip title={i18n.t('components.playground.toolbar.resetCode')}>
          <IconButton onClick={context.resetCode} color="primary">
            <ReplayIcon />
          </IconButton>
        </Tooltip>

        {/* <Button
          variant="outlined"
          startIcon={<PlayArrow />}
          onClick={() => {
            console.log('run custom input');
          }}
        >
          Run
        </Button> */}
        <LoadingButton
          loading={loading}
          variant="contained"
          startIcon={<PublishIcon />}
          onClick={handleSubmit}
        >
          {i18n.t('components.playground.toolbar.submit')}
        </LoadingButton>
      </Stack>
    </Box>
  );
}
