import React from 'react';
import { useTheme, Box, Typography, LinearProgress } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';

import { Module as ModuleType, DEFAULT_IMAGE } from '../../lib/api/module';
import Tag from './Tag';

import styles from '../../styles/components/modules/Module.module.css';

import carrot from '../../images/carrot.png';

type Props = {
  module: ModuleType;
};

export default function Module({ module }: Props) {
  // import mui theme
  const theme = useTheme();

  return (
    <Link href={`/module/${module.id}`}>
      <Box
        className={styles.container}
        sx={{ border: `1px solid ${theme.palette.text.secondary}` }}
      >
        {/* Image */}
        <Box className={styles.imageContainer}>
          <Box
            component="img"
            className={styles.image}
            src={module.image || DEFAULT_IMAGE}
            alt="Module image"
          />
        </Box>

        {/* right part */}
        <Box className={styles.rightContainer}>
          {/* title and tags */}
          <Box className={styles.titleAndTagContainer}>
            <Typography className={styles.title} variant="h4">
              {module.name}
            </Typography>
            {/* Tags */}
            <Box className={styles.tagsContainer}>
              {module.tags && module.tags.length > 0
                ? module.tags.map((tag: string) => <Tag key={tag} tag={tag} />)
                : null}
            </Box>
          </Box>

          {/* description */}
          <Box className={styles.descriptionContainer}>
            <Typography
              className={styles.description}
              sx={{ color: theme.palette.text.secondary }}
            >
              {module.description}
            </Typography>
          </Box>

          {/* Progress and carrot */}
          <Box className={styles.progressAndCarrotContainer}>
            {/* progress */}
            <Box className={styles.progressContainer}>
              {/* number of percentage */}
              <Box className={styles.percentageProgressContainer}>
                <Typography className={styles.percentageProgress}>
                  {module.progress || 0 || 0}%
                </Typography>
              </Box>
              {/* progress bar */}
              <Box>
                <LinearProgress
                  variant="determinate"
                  value={module.progress || 0}
                  className={styles.progress}
                />
              </Box>
            </Box>

            {/* carrot */}
            <Box className={styles.carrotContainer}>
              <Box className={styles.innerCarrotContainer}>
                <Typography className={styles.nbCarrot}>
                  {module.reward}
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
