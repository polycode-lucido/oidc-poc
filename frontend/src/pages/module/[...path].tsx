import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';
import Playground from '../../components/playground/Playground';
import { useTranslation } from '../../lib/translations';

export default function Module() {
  const router = useRouter();
  const { path } = router.query;
  const { i18n } = useTranslation();

  if (!path) return null;

  if (path[path.length - 1] === 'play' && path.length > 1) {
    return <Playground id={`${path[path.length - 2]}`} />;
  }

  return (
    <>
      <Head>
        <title>{i18n.t('pages.module.path.modulesHere')}</title>
      </Head>
      <div>
        <h1>{i18n.t('pages.module.path.modulesHere')}</h1>
      </div>
    </>
  );
}
