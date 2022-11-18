import { ComponentsOverrides, Theme } from '@mui/material';

const MuiInputLabel: {
  styleOverrides?: ComponentsOverrides<Theme>['MuiInputLabel'];
} = {
  styleOverrides: {
    root: ({ theme }) => ({
      color: theme.palette.text.primary,
      fontFamily: 'Varela Round, sans-serif',
      '&.Mui-disabled': {
        color: theme.palette.text.secondary,
      },
    }),
  },
};

export default MuiInputLabel;
