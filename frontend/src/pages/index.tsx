import Head from 'next/head';
import React from 'react';
import Home from '../components/home/HomePage';
import LandingPage from '../components/home/LandingPage';
import { useLoginContext } from '../lib/loginContext';
import { useTranslation } from '../lib/translations';

export default function Index() {
  const { user } = useLoginContext();
  const { i18n } = useTranslation();

  // if user is logged in then show the home page

  if (user)
    return (
      <>
        <Head>
          <title>{i18n.t('pages.index.homeTitle')}</title>
        </Head>
        <Home />
      </>
    );

  // else show the landing page

  return (
    <>
      <Head>
        <title>{i18n.t('pages.index.landingTitle')}</title>
      </Head>
      <LandingPage />
    </>
  );
}
