// errors
export const MissingMetaData = new Error('Missing metadata in response');
export const MissingData = new Error('Missing data in response');
export const UnexpectedResponse = new Error('Unexpected response from server');
export const InvalidCredentialsError = new Error('Invalid credentials');
export const InvalidRefreshTokenError = new Error('Invalid refresh token');

// credentials
export interface Credentials {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  refresh_expires_in: number;
}
export type RefreshUser = () => any;
export type SetCredentials = (newCreds: Credentials | undefined) => void;
export interface CredentialsManager {
  credentials: Credentials | undefined;
  setCredentials: SetCredentials;
}

// API response
export interface AsyncResponse<T> {
  data?: T;
  loading: boolean;
  error: boolean;
}

// 1 minute timeout
const fetchTimeout = 60000;

let loggingIn = false;

let apiServer =
  process.env.NEXT_PUBLIC_API_URL ??
  (process.env.NODE_ENV === 'production'
    ? 'https://api.polycode.dopolytech.fr'
    : 'http://localhost:3000');

export const setApiServer = (newApiServer: string) => {
  apiServer = newApiServer;
};

// Fetch the backend api
export async function fetchApi<MetaDataType, DataType>(
  ressource: string,
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' = 'GET',
  body?: any,
  headers: HeadersInit = {}
): Promise<{
  metadata: MetaDataType;
  data: DataType;
  status: number;
}> {
  const formatedBody = body ? JSON.stringify(body) : undefined;
  const response = await Promise.race([
    fetch(apiServer + ressource, {
      method,
      body: formatedBody,
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
    }),
    new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Request timeout')), fetchTimeout);
    }) as Promise<Response>,
  ]);

  // handle 204 - no content
  if (response.status === 204) {
    return {
      metadata: null as unknown as MetaDataType,
      data: null as unknown as DataType,
      status: 204,
    };
  }

  const json = await response.json();
  return {
    metadata: json.metadata,
    data: json.data,
    status: response.status,
  };
}

export async function refreshTokens(
  credentialsManager: CredentialsManager
): Promise<boolean> {
  const { data, status } = await fetchApi<{}, Credentials>(
    '/auth/token',
    'POST',
    credentialsManager.credentials
  );

  if (status === 201) {
    setTimeout(() => {
      refreshTokens(credentialsManager);
    }, data.expires_in * 1000 - 5000);
    credentialsManager.setCredentials(data);
    return true;
  }

  throw InvalidRefreshTokenError;
}

// Fetch the backend api with automatic refresh
export async function fetchApiWithAuth<MetaDataType, DataType>(
  ressource: string,
  credentialsManager: CredentialsManager,
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' = 'GET',
  body?: any
): Promise<{
  metadata: MetaDataType;
  data: DataType;
  status: number;
}> {
  const tryFetch = async () => {
    if (!credentialsManager.credentials) {
      throw new Error('No credentials');
    }

    return fetchApi<MetaDataType, DataType>(ressource, method, body, {
      Authorization: `Bearer ${credentialsManager.credentials.access_token}`,
    });
  };

  const response = await tryFetch();

  return response;
}

export async function login(
  code: string,
  credentialsManager: CredentialsManager
): Promise<boolean> {
  if (loggingIn) return false;
  loggingIn = true;
  const { data, status } = await fetchApi<{}, Credentials>(
    `/auth/callback?code=${code}`
  );
  loggingIn = false;

  if (status === 200) {
    credentialsManager.setCredentials(data);
    return true;
  }
  throw InvalidCredentialsError;
}

export async function logout(credentialsManager: CredentialsManager) {
  return fetchApiWithAuth(
    '/auth/logout',
    credentialsManager,
    'POST',
    credentialsManager.credentials
  ).finally(() => {
    credentialsManager.setCredentials(undefined);
  });
}
