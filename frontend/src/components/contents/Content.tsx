import React from 'react';
import { useTheme, Box, Typography } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';

import { Content as ContentType } from '../../lib/api/content';

import styles from '../../styles/components/contents/Content.module.css';

import exercise from '../../images/exercise.jpg';
import carrot from '../../images/carrot.png';

type Props = {
  content: ContentType;
};

export default function Content({ content }: Props) {
  // import mui theme
  const theme = useTheme();

  return (
    <Link href={`/content/${content.id}`}>
      <Box
        className={styles.container}
        sx={{ border: `1px solid ${theme.palette.text.secondary}` }}
      >
        {/* header */}
        <Box className={styles.headerContainer}>
          <Typography
            className={styles.type}
            sx={{ color: theme.palette.text.secondary }}
          >
            {content.type}
          </Typography>
          <Box className={styles.titleContainer}>
            <Typography title={content.name} className={styles.title}>
              {content.name}
            </Typography>
          </Box>
        </Box>

        {/* footer */}
        <Box className={styles.footerContainer}>
          <Box className={styles.imageContainer}>
            <Image className={styles.image} src={exercise} />
          </Box>
          {/* description */}
          <Box className={styles.descriptionContainer}>
            <Typography className={styles.description}>
              {content.description}
            </Typography>
            {/* carrot */}
            <Box className={styles.carrotContainer}>
              <Box className={styles.innerCarrotContainer}>
                <Typography className={styles.nbCarrot}>
                  {content.reward}
                </Typography>
                <Image
                  className={styles.carrot}
                  src={carrot}
                  alt="Polypoint logo"
                  width="25px"
                  height="25px"
                />
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Link>
  );
}
