/* eslint-disable react/require-default-props */
import * as React from 'react';
import { Box, Popover, PopoverOrigin, Stack } from '@mui/material';
import { ResponsiveStyleValue } from '@mui/system';

import styles from '../../styles/components/base/ContextualMenu.module.css';

export type Props = {
  children: React.ReactNode;
  target: Element | null;
  isOpen: boolean;
  onClose: () => void;
  direction?: 'up' | 'down' | 'left' | 'right';
};

export default function ContextualMenu({
  children,
  target,
  isOpen,
  onClose,
  direction = 'down',
}: Props) {
  const id = isOpen ? 'contextual-menu' : undefined;

  let anchorOrigin;
  let transformOrigin;
  let stackDirection;
  let stackClassName;
  let arrowClassName;

  switch (direction) {
    case 'up':
      anchorOrigin = { vertical: 'top', horizontal: 'center' };
      transformOrigin = { vertical: 'bottom', horizontal: 'center' };
      stackDirection = 'column-reverse';
      stackClassName = styles.stackUp;
      arrowClassName = styles.arrowDown;
      break;
    case 'down':
      anchorOrigin = { vertical: 'bottom', horizontal: 'center' };
      transformOrigin = { vertical: 'top', horizontal: 'center' };
      stackDirection = 'column';
      stackClassName = styles.stackDown;
      arrowClassName = styles.arrowUp;
      break;
    case 'left':
      anchorOrigin = { vertical: 'center', horizontal: 'left' };
      transformOrigin = { vertical: 'center', horizontal: 'right' };
      stackDirection = 'row-reverse';
      stackClassName = styles.stackLeft;
      arrowClassName = styles.arrowRight;
      break;
    case 'right':
      anchorOrigin = { vertical: 'center', horizontal: 'right' };
      transformOrigin = { vertical: 'center', horizontal: 'left' };
      stackDirection = 'row';
      stackClassName = styles.stackRight;
      arrowClassName = styles.arrowLeft;
      break;
    default:
      anchorOrigin = { vertical: 'bottom', horizontal: 'center' };
      transformOrigin = { vertical: 'top', horizontal: 'center' };
      stackDirection = 'column';
      stackClassName = styles.stackDown;
      arrowClassName = styles.arrowUp;
      break;
  }

  return (
    <Popover
      id={id}
      open={isOpen}
      anchorEl={target}
      onClose={onClose}
      anchorOrigin={anchorOrigin as PopoverOrigin}
      transformOrigin={transformOrigin as PopoverOrigin}
      PaperProps={{
        style: {
          backgroundColor: 'transparent',
          boxShadow: 'none',
          borderRadius: 0,
          overflow: 'visible',
        },
      }}
    >
      <Stack
        direction={
          stackDirection as ResponsiveStyleValue<
            'column' | 'row' | 'column-reverse' | 'row-reverse'
          >
        }
        className={stackClassName}
      >
        <Box className={arrowClassName} />
        <Box className={styles.container}>{children}</Box>
      </Stack>
    </Popover>
  );
}
