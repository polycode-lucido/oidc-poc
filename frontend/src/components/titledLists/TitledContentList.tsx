import React from 'react';
import { Box, Typography } from '@mui/material';

import Content from '../contents/Content';
import { Content as ContentType } from '../../lib/api/content';

import styles from '../../styles/components/home/HomeContentList.module.css';
import { useTranslation } from '../../lib/translations';

type Props = {
  title: string;
  contents: ContentType[];
};

const MAX_CONTENTS = 7;

export default function HomeContentList({ title, contents }: Props) {
  const { i18n } = useTranslation();

  return (
    <Box className={styles.container}>
      <Box>
        <Typography className={styles.title}>{title}</Typography>
      </Box>
      <Box className={styles.contentList}>
        {contents && contents.length > 0
          ? contents.slice(0, MAX_CONTENTS).map((content) => (
              <Box className={styles.contentContainer} key={content.id}>
                <Content content={content} />
              </Box>
            ))
          : i18n.t('components.home.homeContent.empty.contents')}
      </Box>
    </Box>
  );
}
