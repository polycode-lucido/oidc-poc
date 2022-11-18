import { PaletteOptions } from '@mui/material';

const lightPalette: PaletteOptions = {
  mode: 'light',
  secondary: {
    main: '#FFBF00',
    contrastText: '#082946',
    dark: '#ff6d00',
    light: '#f0ff64',
  },
  primary: {
    main: '#7b2cbf',
    dark: '#5A189A',
    light: '#9d4edd',
    contrastText: '#ffffff',
  },
  text: {
    primary: '#082946',
    disabled: '#BEAFD1',
    secondary: '#7A8691',
  },
  error: {
    main: '#FF2000',
    light: '#ec6a09',
  },
  success: {
    main: '#00C4B6',
    light: '#01cd90',
  },
  divider: 'rgba(119,119,119,0.67)',
  info: {
    main: '#3C91ED',
    light: '#1dc7f7',
    dark: '#2a60f5',
  },
};

export default lightPalette;
