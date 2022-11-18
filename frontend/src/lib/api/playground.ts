import {
  CredentialsManager,
  fetchApiWithAuth,
  UnexpectedResponse,
} from './api';
import { EditorLanguage } from './content';

export default function runValidator(
  validatorId: string,
  code: string,
  language: EditorLanguage,
  credentialsManager: CredentialsManager
) {
  return fetchApiWithAuth<
    {},
    { success: boolean; codeResult: { stdout: string; stderr: string } }
  >(`/submission/${validatorId}`, credentialsManager, 'POST', {
    code,
    language,
  });
}

interface SubmissionResult {
  success: boolean;
  validators: {
    uuid: string;
    success: boolean;
  }[];
}

export async function submitCode(
  contentId: string,
  componentId: string,
  code: string,
  language: string,
  credentialsManager: CredentialsManager
) {
  const { data, status } = await fetchApiWithAuth<{}, SubmissionResult>(
    '/submission',
    credentialsManager,
    'POST',
    {
      contentId,
      componentId,
      code,
      language,
    }
  );

  if (status !== 201) {
    throw UnexpectedResponse;
  }
  return data;
}
