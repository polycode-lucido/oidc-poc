import React, { ChangeEvent, useState } from 'react';
import {
  Box,
  TextField,
  Typography,
  Stack,
  Divider,
  Link as MuiLink,
  useTheme,
} from '@mui/material';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import LoadingButton from '@mui/lab/LoadingButton';
import { useTranslation } from '../lib/translations';

import styles from '../styles/pages/SignIn&SignUp.module.css';
import polybunny from '../images/polybunny-do.png';
import { useLoginContext } from '../lib/loginContext';
import { toastError } from '../components/base/toast/Toast';
import { login, InvalidCredentialsError } from '../lib/api/api';

interface EditorState {
  email: string;
  password: string;
}

interface EditorErrors {
  email: string;
  password: string;
}

export default function SignIn() {
  const { user, credentialsManager } = useLoginContext();
  const theme = useTheme();
  const { i18n } = useTranslation();
  const router = useRouter();
  const [editorState, setEditorState] = useState<EditorState>({
    email: '',
    password: '',
  });
  const [editorErrors, setEditorErrors] = useState<EditorErrors>({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  // if the user is logged in, redirect to the home page
  if (user) router.push('/');

  // --- check ---

  const checkEmail = () => {
    if (!editorState.email) {
      setEditorErrors({
        ...editorErrors,
        email: i18n.t('pages.signIn.emailRequired'),
      });
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editorState.email)) {
      setEditorErrors({
        ...editorErrors,
        email: i18n.t('pages.signIn.emailInvalid'),
      });
      return false;
    }
    return true;
  };

  const checkPassword = () => {
    if (!editorState.password) {
      setEditorErrors({
        ...editorErrors,
        password: i18n.t('pages.signIn.passwordRequired'),
      });
      return false;
    }
    return true;
  };

  // --- handlers ---

  const handleEmailChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setEditorState({ ...editorState, email: event.target.value });
  };

  const handlePasswordChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setEditorState({ ...editorState, password: event.target.value });
  };

  const handleLogin = (
    evt: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    evt.preventDefault();

    if (checkEmail() && checkPassword()) {
      setEditorErrors({ email: '', password: '' });
      setLoading(true);
      login(editorState.email, editorState.password, credentialsManager)
        .then(() => {
          // redirect to the last page
          router.back();
        })
        .catch((reason) => {
          // handle error
          if (reason === InvalidCredentialsError) {
            toastError(
              <Typography>
                {i18n.t('pages.signIn.invalidCreditentials')}
              </Typography>
            );
          } else {
            toastError(
              <Typography>{i18n.t('pages.signIn.unexpectedError')}</Typography>
            );
          }
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  // --- render ---

  return (
    <>
      <Head>
        <title>{i18n.t('pages.signIn.title')}</title>
      </Head>
      <Box
        className={styles.container}
        sx={{ color: theme.palette.text.primary }}
      >
        <Box className={styles.logo}>
          <Image src={polybunny} />
        </Box>

        <Divider
          orientation="vertical"
          variant="middle"
          flexItem
          className={styles.divider}
        />

        <Box className={styles.form}>
          <form className={styles.loginForm}>
            <Typography variant="h4">
              <span style={{ color: theme.palette.primary.main }}>Poly</span>
              Code
            </Typography>

            <Stack spacing={2}>
              <TextField
                type="email"
                onChange={handleEmailChange}
                label={i18n.t('pages.signIn.email')}
                variant="standard"
                error={editorErrors.email !== ''}
                helperText={editorErrors.email}
              />

              <TextField
                type="password"
                onChange={handlePasswordChange}
                label={i18n.t('pages.signIn.password')}
                variant="standard"
                error={editorErrors.password !== ''}
                helperText={editorErrors.password}
              />
            </Stack>
            <LoadingButton
              variant="contained"
              className={styles.loginButton}
              onClick={handleLogin}
              loading={loading}
              type="submit"
            >
              {i18n.t('pages.signIn.signIn')}
            </LoadingButton>

            <Typography variant="body1">
              {i18n.t('pages.signIn.noAccountQuestion')}{' '}
              <Link href="/sign-up" passHref>
                <MuiLink>{i18n.t('pages.signIn.signUp')}</MuiLink>
              </Link>
            </Typography>
          </form>
        </Box>
      </Box>
    </>
  );
}
