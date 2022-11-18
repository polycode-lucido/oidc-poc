import React from 'react';
import { Chip } from '@mui/material';

import styles from '../../styles/components/modules/Tag.module.css';
import colors from './tagsColor';

type Props = {
  tag: string;
};

export default function Tag({ tag }: Props) {
  return (
    <Chip
      label={`#${tag}`}
      className={styles.container}
      sx={{ backgroundColor: colors[tag.toLowerCase()] }}
    />
  );
}
