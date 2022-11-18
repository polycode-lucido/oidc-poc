import Link from 'next/link';
import React from 'react';
import { Box, Button, Stack, Typography, useTheme } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { useTranslation } from '../../lib/translations';

type Props = {
  userId: string;
};

export default function ContextualMenuUser({ userId }: Props) {
  const theme = useTheme();
  const { i18n } = useTranslation();
  return (
    <Link href={`/account/${userId}`}>
      <Box>
        <Button>
          <Stack spacing={1} direction="row" color={theme.palette.text.primary}>
            <InfoIcon />
            <Typography variant="body1">
              {i18n.t('components.team.contextualMenuUser.info')}
            </Typography>
          </Stack>
        </Button>
      </Box>
    </Link>
  );
}
