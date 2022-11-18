import React, { useEffect } from 'react';
import { Box } from '@mui/material';
import Head from 'next/head';
import App, { AppContext, AppProps } from 'next/app';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider, EmotionCache } from '@emotion/react';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import createEmotionCache from '../lib/emotionCache';
import { TranslationProvider } from '../lib/translations';
import { ThemeManagerProvider } from '../lib/themeManager';
import { LoginContextProvider } from '../lib/loginContext';
import NavBar from '../components/navbar/NavBar';

import '../styles/globals.css';
import '../styles/components/base/toast.css';
import styles from '../styles/pages/app.module.css';
import { setApiServer } from '../lib/api/api';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
  apiUrl: string;
}

export default function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps, apiUrl } = props;

  useEffect(() => {
    if (apiUrl) {
      setApiServer(apiUrl);
    }
  }, [apiUrl]);

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
      <CssBaseline />
      <TranslationProvider>
        <ThemeManagerProvider>
          <LoginContextProvider>
            <Box className={styles.container}>
              <Box className={styles.nav}>
                <NavBar />
              </Box>
              <Component {...pageProps} />
            </Box>
            <ToastContainer
              theme="colored"
              position="top-right"
              autoClose={4000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />
          </LoginContextProvider>
        </ThemeManagerProvider>
      </TranslationProvider>
    </CacheProvider>
  );
}

MyApp.getInitialProps = async (appContext: AppContext) => {
  const appProps = await App.getInitialProps(appContext);
  return { ...appProps, apiUrl: process.env.PUBLIC_API_URL }
}
