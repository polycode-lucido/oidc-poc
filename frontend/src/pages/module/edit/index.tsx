import Head from 'next/head';
import React from 'react';
import ModuleEditor from '../../../components/modules/editor/ModuleEditor';
import { useTranslation } from '../../../lib/translations';

// Create a new module, just render the ModuleEditor component without any data.

export default function NewModule() {
  const { i18n } = useTranslation();

  return (
    <>
      <Head>
        <title>{i18n.t('pages.module.edit.index.title')}</title>
      </Head>
      <ModuleEditor />
    </>
  );
}
