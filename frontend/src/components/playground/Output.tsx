import {
  Badge,
  Box,
  styled,
  // TextField as MuiTextField,
  ToggleButton as MuiToggleButton,
  ToggleButtonGroup as MuiToggleButtonGroup,
} from '@mui/material';
import React, { useEffect } from 'react';
import { useTranslation } from '../../lib/translations';

import styles from '../../styles/components/playground/Output.module.css';
import { useEditorContext } from './CodeEditorContext';

const ToggleButton = styled(MuiToggleButton)`
  color: #999;
  text-transform: none;
  &.Mui-selected {
    color: #d4d4d4;
    background: rgba(128, 128, 128, 0.2);
  }
  border: none;
  border-radius: 0;
`;
const ToggleButtonGroup = styled(MuiToggleButtonGroup)`
  background: rgba(128, 128, 128, 0.15);
  color: #d4d4d4;
  border: none;
  border-radius: 0;
`;

// const TextField = styled(MuiTextField)(() => ({
//   background: '#1e1e1e',
//   color: '#d4d4d4',
//   '& .MuiInputBase-input': {
//     color: '#d4d4d4',
//   },
//   '& .MuiInputLabel-root': {
//     color: '#d4d4d4',
//   },
//   '& .MuiOutlinedInput-notchedOutline': {
//     borderColor: '#d4d4d460',
//   },
//   '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
//     borderColor: '#d4d4d4',
//   },
// }));
export default function Output() {
  const context = useEditorContext();

  const { i18n } = useTranslation();

  const [selectedOutput, setSelectedOutput] = React.useState<string | null>(
    'stdout'
  );

  const [errorSeen, setErrorSeen] = React.useState(true);

  const handleChange = (event: unknown, value: string | null) => {
    if (value) setSelectedOutput(value);
  };

  useEffect(() => {
    if (selectedOutput === 'stderr') setErrorSeen(true);
    else if (context.lastOutput.stderr.length > 0) setErrorSeen(false);
  }, [context.lastOutput.stderr.length, selectedOutput]);

  // const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   context.setCustomInput(event.target.value || '');
  // };

  let content = null;
  switch (selectedOutput) {
    case 'stdout':
      content = <pre>{context.lastOutput.stdout}</pre>;
      break;
    case 'stderr':
      content = <pre>{context.lastOutput.stderr}</pre>;
      break;
    // case 'stdin':
    //   content = (
    //     <Box
    //       sx={{
    //         // backgroundColor: 'background.default',
    //         p: 1,
    //         overflow: 'auto',
    //         borderRadius: '3px',
    //       }}
    //     >
    //       <TextField
    //         fullWidth
    //         label="custom input"
    //         multiline
    //         maxRows={2}
    //         minRows={2}
    //         value={context.customInput}
    //         onChange={handleInputChange}
    //       />
    //     </Box>
    //   );
    //   break;

    default:
      content = null;
  }

  return (
    <Box className={styles.container}>
      <ToggleButtonGroup
        value={selectedOutput}
        onChange={handleChange}
        exclusive
        className={styles.buttonGroup}
      >
        <ToggleButton disableRipple value="stdout">
          {i18n.t('components.playground.output.console')}
        </ToggleButton>
        <ToggleButton disableRipple value="stderr">
          <Badge
            color="warning"
            variant="dot"
            invisible={errorSeen}
            // overlap="circular"
          >
            {i18n.t('components.playground.output.debug')}
          </Badge>
        </ToggleButton>
        {/* <ToggleButton disableRipple value="stdin">
          custom input
        </ToggleButton> */}
      </ToggleButtonGroup>
      <Box className={styles.out}>{content}</Box>
    </Box>
  );
}

Output.defaultProps = {
  stderr: '',
};
