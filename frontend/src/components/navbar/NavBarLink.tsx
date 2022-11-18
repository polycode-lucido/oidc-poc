import { Typography, useTheme } from '@mui/material';
import Link from 'next/link';
import React from 'react';

type Props = {
  href: string;
  children: React.ReactNode;
};

export default function NavBarLink({ href, children, ...props }: Props) {
  const theme = useTheme();
  return (
    <Link {...props} href={href}>
      <Typography
        color={theme.palette.primary.main}
        variant="h6"
        sx={{
          '&:hover': {
            textDecoration: 'underline',
            cursor: 'pointer',
          },
        }}
      >
        {children}
      </Typography>
    </Link>
  );
}
