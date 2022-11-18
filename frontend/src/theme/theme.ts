import {
  Components,
  createTheme,
  PaletteMode,
  PaletteOptions,
  Theme,
} from '@mui/material';
import breakpoints from './breakpoints';
import MuiButton from './components/base/Button';
import MuiInputBase from './components/base/MuiInputBase';
import MuiInputLabel from './components/base/MuiInputLabel';
import lightPalette from './LightTheme';
import typography from './typography';

// Put component styles here
const components: Components<Theme> = {
  MuiButton,
  MuiInputBase,
  MuiInputLabel,
};

// Color palettes
const darkPalette: PaletteOptions = {};

export function GetTheme(mode: PaletteMode) {
  return createTheme({
    palette: mode === 'light' ? lightPalette : darkPalette,
    components,
    typography,
    breakpoints,
  });
}

const defaultTheme = createTheme({
  palette: lightPalette,
  components,
  typography,
  breakpoints,
});
export default defaultTheme;
