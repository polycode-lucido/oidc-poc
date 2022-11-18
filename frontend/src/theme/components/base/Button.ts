import { ComponentsOverrides, Theme } from '@mui/material';

// Change button style here
const MuiButton: {
  styleOverrides?: ComponentsOverrides<Theme>['MuiButton'];
} = {
  styleOverrides: {
    root: ({ ownerState }) => ({
      ':hover': ownerState.variant !== 'text' && {
        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
      },
      borderRadius: '5px',
      boxShadow: 'none',
      textTransform: 'none',
    }),
  },
};
export default MuiButton;
