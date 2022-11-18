import React from 'react';
import { Button } from '@mui/material';
import { useThemeManager } from '../lib/themeManager';

export default function ThemeToggle() {
  const themeManager = useThemeManager();

  function toggle() {
    themeManager.setMode(themeManager.mode === 'light' ? 'dark' : 'light');
  }

  return (
    <Button
      onClick={() => {
        toggle();
      }}
    >
      {themeManager.mode}
    </Button>
  );
}
