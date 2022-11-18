import { Box } from '@mui/material';
import React from 'react';
import { Component } from '../../lib/api/content';
// eslint-disable-next-line import/no-cycle
import PlaygroundComponent from './Component';

import styles from '../../styles/components/playground/VerticalContainer.module.css';

export default function VerticalContainer({
  components,
}: {
  components: Component[];
}) {
  const componentsJSx = components.map((c) => (
    <PlaygroundComponent key={c.id} component={c} />
  ));
  return <Box className={styles.container}>{componentsJSx}</Box>;
}
