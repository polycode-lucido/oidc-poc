import { ComponentsOverrides, Theme } from '@mui/material';

const MuiInputBase: {
  styleOverrides?: ComponentsOverrides<Theme>['MuiInputBase'];
} = {
  styleOverrides: {
    root: ({ ownerState, theme }) => ({
      input: {
        fontFamily: 'Varela Round, sans-serif',
        color: ownerState.focused
          ? theme.palette.text.primary
          : 'theme.palette.primary.main',
        '&.Mui-disabled': {
          border: '0 none',
          borderBottom: `1px solid ${theme.palette.text.secondary}`,
        },
      },
    }),
  },
};
export default MuiInputBase;
