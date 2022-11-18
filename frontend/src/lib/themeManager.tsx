import { PaletteMode, ThemeProvider } from '@mui/material';
import React, { useMemo, useState } from 'react';
import { GetTheme } from '../theme/theme';

/*
  ThemeManager is a wrapper around the ThemeProvider component.

  You can change the theme mode by calling setMode().
*/
export const ThemeManagerContext = React.createContext<{
  mode: PaletteMode;
  setMode: (theme: PaletteMode) => void;
}>({
  mode: 'light',
  setMode: (mode: PaletteMode) => mode,
});

/*
  ThemeManager is a wrapper around the ThemeProvider component.

  You can change the theme mode by calling setMode().

  This is the context provider
*/
export function ThemeManagerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mode, setMode] = useState<PaletteMode>('light');

  const value = useMemo(() => ({ mode, setMode }), [mode, setMode]);

  return (
    <ThemeManagerContext.Provider value={value}>
      <ThemeProvider theme={GetTheme(mode)}>{children}</ThemeProvider>
    </ThemeManagerContext.Provider>
  );
}

/*
  ThemeManager is a wrapper around the ThemeProvider component.

  You can change the theme mode by calling setMode().

  This function returns the context value.
*/
export function useThemeManager() {
  const context = React.useContext(ThemeManagerContext);

  if (context === undefined) {
    throw new Error('useThemeManager must be used within a ThemeManagerProvider');
  }

  return context;
}
