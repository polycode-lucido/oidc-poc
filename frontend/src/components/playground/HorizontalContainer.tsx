import { Box, Divider } from '@mui/material';
import React from 'react';
import { Component, CodeEditorComponent } from '../../lib/api/content';
import { EditorContextProvider } from './CodeEditorContext';
// Cycle looks inevitable since we can render a container in a container
// eslint-disable-next-line import/no-cycle
import PlaygroundComponent from './Component';
import Hints from './Hints';
import SideEditor from './SideEditor';
import Validators from './Validators';

import styles from '../../styles/components/playground/HorizontalContainer.module.css';
import dividerStyles from '../../styles/components/playground/Divider.module.css';
import vertStyles from '../../styles/components/playground/VerticalContainer.module.css';

interface HorizontalContainerProps {
  components: Component[];
}

export default function HorizontalContainer({
  components,
}: HorizontalContainerProps) {
  // filter out the editors

  const editors = components.filter(
    (c) => c.type === 'editor'
  ) as CodeEditorComponent[];

  // work like a vertical container if there is no editor
  if (editors.length === 0) {
    return (
      <Box className={vertStyles.container}>
        {components.map((c) => (
          <PlaygroundComponent component={c} key={c.id} />
        ))}
      </Box>
    );
  }

  const leftComponents = components.filter((c) => c.type !== 'editor');

  // render the left components

  const leftComponetsJSX = leftComponents.map((c) => (
    <PlaygroundComponent component={c} key={c.id} />
  ));

  return (
    <EditorContextProvider editorComponent={editors[0]}>
      <Box className={styles.root}>
        <Box className={styles.left}>
          <Box className={styles.components}>{leftComponetsJSX}</Box>

          <Box>
            <Validators />

            <Hints />
          </Box>
        </Box>
        <Divider orientation="vertical" className={dividerStyles.vDivider} />

        <SideEditor />
      </Box>
    </EditorContextProvider>
  );
}
