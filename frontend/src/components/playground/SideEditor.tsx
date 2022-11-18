import { Box } from '@mui/material';
import React from 'react';
import Editor from '@monaco-editor/react';

import Output from './Output';
import { useEditorContext } from './CodeEditorContext';
import Toolbar from './Toolbar';

import styles from '../../styles/components/playground/SideEditor.module.css';
import { getMonacoLanguageNameFromEditorLanguage } from '../../lib/api/content';

export default function SideEditor() {
  const context = useEditorContext();

  return (
    <Box className={styles.container}>
      <Toolbar />
      <Box className={styles.editorBackground}>
        <Editor
          className="editor"
          value={context.code}
          theme="vs-dark"
          onChange={(newValue) => {
            context.setCode(newValue || '');
          }}
          language={getMonacoLanguageNameFromEditorLanguage(context.language)}
          height="calc(100vh - var(--nav-height) - var(--toolbar-height) - var(--output-height) - 1rem )"
          width="calc(50vw - 2rem)"
        />
      </Box>
      <Output />
    </Box>
  );
}
