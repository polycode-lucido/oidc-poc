import { Typography } from '@mui/material';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';
import { toastError, toastSuccess } from '../../../components/base/toast/Toast';
import ContentEditorWizard from '../../../components/contents/edit/ContentEditorWizard';
import {
  Content,
  defaultContent,
  getContent,
  updateContent,
} from '../../../lib/api/content';
import { useRequireValidUser } from '../../../lib/loginContext';
import { useTranslation } from '../../../lib/translations';

export default function ContentEditor() {
  const { i18n } = useTranslation();
  const { credentialsManager } = useRequireValidUser();
  const router = useRouter();
  const { id } = router.query;
  const [content, setContent] = React.useState<Content>(
    defaultContent as Content
  );
  const [fetchLoading, setFetchLoading] = React.useState(false);
  const [saveLoading, setSaveLoading] = React.useState(false);

  React.useEffect(() => {
    setFetchLoading(true);
    if (typeof id === 'string') {
      getContent(credentialsManager, id)
        .then((c) => setContent(c))
        .catch(() =>
          toastError(
            <Typography>
              {i18n.t('pages.content.edit.id.fetchError')}
            </Typography>
          )
        )
        .finally(() => setFetchLoading(false));
    }
  }, [credentialsManager, i18n, id]);

  // --- handlers ---

  const handleSave = () => {
    setSaveLoading(true);
    updateContent(credentialsManager, typeof id === 'string' ? id : '', {
      ...content,
      id: undefined,
      data: {},
    })
      .then(() => {
        toastSuccess(
          <Typography>{i18n.t('pages.content.edit.id.saveSuccess')}</Typography>
        );

        router.push(`/content/${id}`);
      })
      .catch(() =>
        toastError(
          <Typography>{i18n.t('pages.content.edit.id.saveError')}</Typography>
        )
      )
      .finally(() => setSaveLoading(false));
  };

  // --- render ---

  return (
    <>
      <Head>
        <title>{i18n.t('pages.content.edit.id.title')}</title>
      </Head>
      <ContentEditorWizard
        content={content}
        onChange={setContent}
        onSave={handleSave}
        isLoading={fetchLoading}
        isSaving={saveLoading}
        titleText={i18n.t('pages.content.edit.id.title')}
      />
    </>
  );
}
