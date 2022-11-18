import { Box, CircularProgress } from '@mui/material';
import React from 'react';

import styles from '../../styles/components/base/CenteredLoader.module.css';

export default function CenteredLoader() {
  return (
    <Box className={styles.container}>
      <CircularProgress />
    </Box>
  );
}
