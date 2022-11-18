import { Skeleton, Stack, Typography, useTheme } from '@mui/material';
import Image from 'next/image';
import React from 'react';

type Props = {
  label: string;
  value: string | undefined;
  image?: string;
  isLoading?: boolean;
};

export default function MenuRow({
  label,
  value,
  image,
  isLoading = false,
}: Props) {
  const theme = useTheme();

  return (
    <Stack
      direction="row"
      flexGrow={1}
      width={280}
      justifyContent="space-between"
    >
      <Typography variant="h5">{label}</Typography>
      <Stack direction="row" alignItems="center" spacing={20}>
        {!isLoading ? (
          <Typography
            variant="h6"
            sx={{
              color: theme.palette.text.primary,
              marginRight: image ? '10px' : 0,
            }}
          >
            {value}
          </Typography>
        ) : (
          <Skeleton variant="text" width={100} />
        )}
        {image && <Image src={image} width="32" height="32" />}
      </Stack>
    </Stack>
  );
}

MenuRow.defaultProps = {
  image: undefined,
};
