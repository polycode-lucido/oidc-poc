import * as React from 'react';
import { Box, Button, useTheme } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import SettingsIcon from '@mui/icons-material/Settings';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from '../../lib/translations';

import styles from '../../styles/components/account/Menu.module.css';
import profileImage from '../../images/profil_image.svg';

type Props = {
  buttonSelected: 'profile' | 'settings' | 'teams' | 'password';
};

export default function Menu({ buttonSelected }: Props) {
  const { i18n } = useTranslation();

  // import MUI theme
  const theme = useTheme();

  return (
    <Box className={styles.container}>
      <Box className={styles.innerContainer}>
        {/* profile image */}
        <Box className={styles.profileImage}>
          <Image src={profileImage} />
        </Box>
        {/* navigation buttons */}
        <Box
          sx={{ color: theme.palette.text.primary }}
          className={styles.navigationButtons}
        >
          <Link href="/account/profile">
            <Button
              id="profile"
              className={styles.button}
              startIcon={<PersonIcon className={styles.icon} />}
              color={buttonSelected === 'profile' ? 'primary' : 'inherit'}
            >
              {i18n.t('components.account.menu.profile')}
            </Button>
          </Link>
          <Link href="/account/settings">
            <Button
              id="settings"
              className={styles.button}
              startIcon={<SettingsIcon className={styles.icon} />}
              color={buttonSelected === 'settings' ? 'primary' : 'inherit'}
            >
              {i18n.t('components.account.menu.settings')}
            </Button>
          </Link>
          <Link href="/account/teams">
            <Button
              id="teams"
              className={styles.button}
              startIcon={<PeopleAltIcon className={styles.icon} />}
              color={buttonSelected === 'teams' ? 'primary' : 'inherit'}
            >
              {i18n.t('components.account.menu.teams')}
            </Button>
          </Link>
        </Box>
      </Box>
    </Box>
  );
}
