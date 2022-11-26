import { Typography } from '@mui/material';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useTranslation } from '../lib/translations';

import { toastError } from '../components/base/toast/Toast';
import { InvalidCredentialsError, login } from '../lib/api/api';
import { useLoginContext } from '../lib/loginContext';

export default function SignIn() {
  const { user, credentialsManager } = useLoginContext();
  const { i18n } = useTranslation();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const { code } = router.query;

  // if the user is logged in, redirect to the home page
  if (user) router.push('/');
  if (!code) {
    router.push(
      `${process.env.NEXT_PUBLIC_KEYCLOAK_URL}/auth?client_id=${process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID}&response_type=code&scope=profile&redirect_uri=${process.env.NEXT_PUBLIC_KEYCLOAK_REDIRECT_SIGN_IN_URI}`
    );
  }

  // if there is a code, try to get tokens
  useEffect(() => {
    if (code && !loading) {
      setLoading(true);
      login(code as string, credentialsManager)
        .then(() => {
          // redirect to the last page
          router.push('/');
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
  }, []);

  // --- render ---

  return loading ? <h1>Loading...</h1> : <h1>Logged in !</h1>;
}
