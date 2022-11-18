import React from 'react';
import { Box, Typography } from '@mui/material';

import Content from './Content';
import { Content as ContentType } from '../../lib/api/content';

import styles from '../../styles/components/contents/ContentList.module.css';
import { useTranslation } from '../../lib/translations';

type Props = {
  contents: ContentType[];
};

export default function ContentList({ contents }: Props) {
  const { i18n } = useTranslation();

  return (
    <Box className={styles.container}>
      {contents && contents.length > 0 ? (
        contents.map((content: ContentType) => (
          <Box key={content.id} className={styles.contentContainer}>
            <Content content={content} />
          </Box>
        ))
      ) : (
        <Typography className={styles.notFoundMessage}>
          {i18n.t('components.contents.contentList.notFound')}
        </Typography>
      )}
    </Box>
  );
}
