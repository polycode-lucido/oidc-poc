import React from 'react';
import { Box, IconButton, Typography, Stack, Link } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useTranslation } from '../../lib/translations';
import { useLoginContext } from '../../lib/loginContext';
import { logout } from '../../lib/api/api';
// import { toastError } from '../base/toast/Toast';

import polybunny from '../../images/polybunny-navbar-menu.png';

import styles from '../../styles/components/navbar/Menu.module.css';

type Props = {
  handleMenu: () => void;
};

export default function Menu({ handleMenu }: Props) {
  const { user, credentialsManager } = useLoginContext();
  const { i18n } = useTranslation();

  const router = useRouter();

  // --- handle events ---
  const handleLogout = async () => {
    // revoke token + remove user from context & local storage
    try {
      await logout(credentialsManager);
    } catch (e) {
      // toastError(<Typography>Logout error</Typography>);
    }

    // back to landing page
    router.push('/');

    // close menu
    handleMenu();
  };

  return (
    <Box className={styles.container}>
      {/* close button */}
      <Box className={styles.closeIconContainer}>
        <IconButton
          size="large"
          edge="end"
          color="inherit"
          onClick={handleMenu}
        >
          <CloseIcon className={styles.closeIcon} />
        </IconButton>
      </Box>

      {/* links container */}
      <Box className={styles.linksContainer}>
        {/* links */}
        <Stack
          direction="column"
          alignItems="center"
          spacing={2}
          className={user ? '' : styles.linksStack}
        >
          <Link href="/account/profile">
            <Typography className={styles.linkItem} variant="h1">
              {i18n.t('components.navbar.menu.profile')}
            </Typography>
          </Link>
          <Link href="/leaderboard">
            <Typography className={styles.linkItem} variant="h1">
              {i18n.t('components.navbar.menu.leaderboard')}
            </Typography>
          </Link>
          <Link href="/module">
            <Typography className={styles.linkItem} variant="h1">
              {i18n.t('components.navbar.menu.modules')}
            </Typography>
          </Link>
          <Link href="/content">
            <Typography className={styles.linkItem} variant="h1">
              {i18n.t('components.navbar.menu.contents')}
            </Typography>
          </Link>
        </Stack>

        {/* logout */}

        {user && (
          <Box className={styles.logoutContainer}>
            <Typography
              className={styles.linkItem}
              variant="h1"
              onClick={handleLogout}
            >
              {i18n.t('components.navbar.menu.logout')}
            </Typography>
          </Box>
        )}
      </Box>

      {/* polybunny image */}
      <Box className={styles.imageContainer}>
        <Image
          src={polybunny}
          alt="polybunny image"
          layout="fill"
          objectFit="contain"
        />
      </Box>
    </Box>
  );
}
