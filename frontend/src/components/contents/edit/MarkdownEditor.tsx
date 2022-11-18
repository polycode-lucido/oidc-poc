import React from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Divider,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import { MarkdownComponent } from '../../../lib/api/content';
import { useTranslation } from '../../../lib/translations';
import Markdown from '../../playground/Markdown';

import stylesCommon from '../../../styles/components/contents/edit/common.module.css';
import styles from '../../../styles/components/contents/edit/MarkdownEditor.module.css';

export type Props = {
  markdown: MarkdownComponent;
  onChange: (markdown: MarkdownComponent) => void;
  removeButton?: React.ReactNode;
};

export default function MarkdownEditor({
  markdown,
  onChange,
  removeButton,
}: Props) {
  const { i18n } = useTranslation();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...markdown,
      data: {
        ...markdown.data,
        markdown: event.target.value,
      },
    });
  };

  return (
    <Accordion className={stylesCommon.container}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        className={stylesCommon.headerContainer}
      >
        <Stack direction="row" className={stylesCommon.header}>
          <Typography>
            {i18n.t('components.contents.edit.markdownEditor.type')}
          </Typography>
          {removeButton || <div />}
        </Stack>
      </AccordionSummary>
      <AccordionDetails>
        <Stack direction="row" className={styles.container}>
          <Stack direction="column" className={styles.columnContainer}>
            <Typography>
              {i18n.t('components.contents.edit.markdownEditor.editor')}
            </Typography>
            <TextField
              multiline
              value={markdown.data.markdown}
              onChange={handleChange}
              className={styles.editor}
              variant="standard"
            />
          </Stack>
          <Divider flexItem orientation="vertical" variant="middle" />
          <Stack
            direction="column"
            spacing={1}
            className={styles.columnContainer}
          >
            <Typography>
              {i18n.t('components.contents.edit.markdownEditor.preview')}
            </Typography>
            <Markdown
              content={markdown.data.markdown || ''}
              className={styles.preview}
            />
          </Stack>
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
}
