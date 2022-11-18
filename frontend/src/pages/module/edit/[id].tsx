import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';

import ModuleEditor from '../../../components/modules/editor/ModuleEditor';
import { useTranslation } from '../../../lib/translations';

export default function Editor() {
  const router = useRouter();
  const { id } = router.query;
  const { i18n } = useTranslation();

  if (!id) return null;

  return (
    <>
      <Head>
        <title>{i18n.t('pages.module.edit.id.title')}</title>
      </Head>
      <ModuleEditor id={`${id}`} />
    </>
  );
}
