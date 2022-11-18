import { useTheme } from '@mui/material';
import React from 'react';

export default function TrashIcon() {
  const theme = useTheme();

  return (
    <svg
      width="30"
      height="34"
      viewBox="0 0 30 34"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4.96217 33.5C4.22884 33.5 3.58717 33.225 3.03717 32.675C2.48717 32.125 2.21217 31.4833 2.21217 30.75V4.625H0.333008V1.875H8.94967V0.5H21.0497V1.875H29.6663V4.625H27.7872V30.75C27.7872 31.4833 27.5122 32.125 26.9622 32.675C26.4122 33.225 25.7705 33.5 25.0372 33.5H4.96217ZM25.0372 4.625H4.96217V30.75H25.0372V4.625ZM9.82051 26.8083H12.5705V8.52083H9.82051V26.8083ZM17.4288 26.8083H20.1788V8.52083H17.4288V26.8083ZM4.96217 4.625V30.75V4.625Z"
        fill={theme.palette.error.main}
      />
    </svg>
  );
}
