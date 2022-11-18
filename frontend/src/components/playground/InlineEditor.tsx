import { Box } from '@mui/material';
import React from 'react';
import Editor from '@monaco-editor/react';
import Validators from './Validators';
import Hints from './Hints';
import { useEditorContext } from './CodeEditorContext';
import Toolbar from './Toolbar';
import Output from './Output';

import styles from '../../styles/components/playground/InlineEditor.module.css';
import { getMonacoLanguageNameFromEditorLanguage } from '../../lib/api/content';
// import dividerStyles from '../../styles/components/playground/Divider.module.css';

export default function InlineEditor() {
  const context = useEditorContext();
  return (
    <Box>
      <Box className={styles.toolbarContainer}>
        <Toolbar />
      </Box>

      <Editor
        value={context.code}
        theme="vs-dark"
        onChange={(value) => context.setCode(value || '')}
        language={getMonacoLanguageNameFromEditorLanguage(context.language)}
        height="40vh"
        width="100%"
      />

      <Output />

      <Box>
        {/* <Divider className={dividerStyles.hDivider} /> */}
        <Validators />

        {/* <Divider className={dividerStyles.hDivider} /> */}
        <Hints />
      </Box>
    </Box>
  );
}
