import React, { useState } from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Stack,
  useTheme,
} from '@mui/material';
import Link from 'next/link';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import Image from 'next/image';

import Polypoints from '../Polypoints';
import NavBarLink from './NavBarLink';
import Menu from './Menu';
import { useLoginContext } from '../../lib/loginContext';

import styles from '../../styles/components/navbar/NavBar.module.css';
import { useTranslation } from '../../lib/translations';

import logo from '../../images/logo.png';

export default function NavBar() {
  const { user } = useLoginContext();

  const theme = useTheme();
  const { i18n } = useTranslation();

  // --- states ---
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // --- handle events ---
  const handleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      {!isMenuOpen && (
        <AppBar className={styles.transparent} position="static">
          <Toolbar sx={{ backgroundColor: 'white', m: 1 }}>
            {/* title */}

            <Link href="/">
              <Box className={styles.homeLink}>
                <IconButton
                  size="small"
                  edge="start"
                  color="inherit"
                  aria-label="open drawer"
                  sx={{ mr: 2 }}
                  disableRipple
                >
                  <Image src={logo} width={72} height={72} />
                </IconButton>

                <Typography
                  variant="h4"
                  noWrap
                  component="div"
                  color={theme.palette.primary.main}
                  sx={{
                    display: { xs: 'none', sm: 'block' },
                  }}
                >
                  Poly
                  <span style={{ color: theme.palette.text.primary }}>
                    Code
                  </span>
                </Typography>
              </Box>
            </Link>

            {/* stack of links */}
            <Stack
              spacing={{ lg: 10, xl: 16 }}
              direction="row"
              sx={{ ml: 18, display: { xs: 'none', md: 'none', lg: 'flex' } }}
            >
              <NavBarLink href="/module">
                {i18n.t('components.navbar.navBar.modules')}
              </NavBarLink>
              <NavBarLink href="/content">
                {i18n.t('components.navbar.navBar.contents')}
              </NavBarLink>
              <NavBarLink href="/certification">
                {i18n.t('components.navbar.navBar.certification')}
              </NavBarLink>
            </Stack>

            {/* separator */}
            <Box sx={{ flexGrow: 1 }} />

            {/* stack of icons */}
            <Stack spacing={4} direction="row">
              {user && (
                <Box className={styles.iconsContainer}>
                  <Polypoints points={user.points} size="normal" />
                  <IconButton
                    className={styles.menuIcon}
                    size="large"
                    edge="end"
                    color="inherit"
                    onClick={handleMenu}
                  >
                    <MenuRoundedIcon
                      fontSize="large"
                      sx={{ color: theme.palette.primary.main }}
                    />
                  </IconButton>
                </Box>
              )}
              {!user && (
                <span style={{ marginRight: '12px' }}>
                  <NavBarLink href="/sign-in">
                    {i18n.t('components.navbar.navBar.signIn')}
                  </NavBarLink>
                </span>
              )}
            </Stack>
          </Toolbar>
        </AppBar>
      )}
      {isMenuOpen && <Menu handleMenu={handleMenu} />}
      {/* Sould be used when the NavBar will be set to fixed */}
      {/* <Toolbar sx={{height: "114px"}} /> */}
    </>
  );
}
