import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
  PreviewData,
} from 'next';
import { ParsedUrlQuery } from 'querystring';

import { Box, Button, Typography } from '@mui/material';
import Head from 'next/head';
import Link from 'next/link';
import { validateEmail } from '../../../lib/api/user';
import { useTranslation } from '../../../lib/translations';
import { useLoginContext } from '../../../lib/loginContext';

import styles from '../../../styles/pages/email/verification/EmailVerification.module.css';
import { toastSuccess } from '../../../components/base/toast/Toast';

export default function EmailVerification({
  code,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();

  const { user } = useLoginContext();

  const [isLoading, setIsLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(false);

  const { i18n } = useTranslation();

  console.log('render');

  useEffect(() => {
    if (code && (user || user === null)) {
      console.log('trigger', user, code);
      setIsLoading(true);
      validateEmail(`${code}`)
        .then(() => {
          setIsVerified(true);
          toastSuccess(i18n.t('pages.email.verification.success'));

          // redirect to the home page
          router.push('/');
        })
        .catch(() => setIsVerified(false))
        .finally(() => setIsLoading(false));
    }
  }, [code, i18n, router, user]);

  return (
    <>
      <Head>
        <title>{i18n.t('pages.email.verification.title')}</title>
      </Head>
      <Box className={styles.container}>
        {isLoading ? (
          <Typography>{i18n.t('pages.email.verification.progress')}</Typography>
        ) : (
          <Box>
            {!!isVerified && (
              <Typography>
                {i18n.t('pages.email.verification.failed')}
              </Typography>
            )}

            {user ? (
              <Link href="/" passHref>
                <Button variant="contained" className={styles.button}>
                  {i18n.t('pages.email.verification.home')}
                </Button>
              </Link>
            ) : (
              <Link href="/sign-in" passHref>
                <Button variant="contained" className={styles.button}>
                  {i18n.t('pages.email.verification.signIn')}
                </Button>
              </Link>
            )}
          </Box>
        )}
      </Box>
    </>
  );
}

export async function getServerSideProps(
  ctx: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>
) {
  const { code } = ctx.query;

  return {
    props: { code }, // will be passed to the page component as props
  };
}
