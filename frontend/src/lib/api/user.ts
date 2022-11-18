import useSWR from 'swr';
import {
  AsyncResponse,
  CredentialsManager,
  fetchApi,
  fetchApiWithAuth,
  MissingData,
  UnexpectedResponse,
} from './api';
import { EditorLanguage } from './content';
import { PaginatedMeta, PaginatedResponse } from './pagination';
import { getTeam, Team } from './team';

export const UserAlreadyExists = new Error('User already exists');

// Response structures (models)

export interface User {
  id: string;
  username: string;
  description?: string;
  points: number;
  rank?: number;
  updatedAt?: string;
  createdAt?: string;
}

export interface UserEmail {
  id: string;
  userId: string;
  email: string;
  isVerified: boolean;
}

export interface UserSettings {
  id: string;
  userId: string;
  preferredEditingLanguage: EditorLanguage;
  preferredLanguage: string;
}

// Request structure

export interface CreateUserRequest {
  email: string;
  username: string;
  password: string;
}

export interface CreateUserEmailRequest {
  email: string;
}

export interface UpdateUserRequest {
  username: string;
}

export interface UpdateUserSettingsRequest {
  preferredEditingLanguage?: EditorLanguage;
  preferredLanguage?: string;
}

// Filters

export interface UserFilters {
  page?: number;
  limit?: number;
  orderBy?: {
    points?: 'asc' | 'desc';
  };
}

export const defaultFilters: UserFilters = {
  page: undefined,
  limit: undefined,
  orderBy: undefined,
};

// Create functions

export async function createUser(request: CreateUserRequest): Promise<User> {
  const { data, status } = await fetchApi<{}, User>('/user', 'POST', request);

  if (status === 201) {
    if (typeof data === 'undefined') throw MissingData;
    return data;
  }
  if (status === 409) throw UserAlreadyExists;
  throw UnexpectedResponse;
}

export async function createUserEmail(
  credentialsManager: CredentialsManager,
  userId: string,
  request: CreateUserEmailRequest
): Promise<boolean> {
  const { status } = await fetchApiWithAuth<{}, boolean>(
    `/user/${userId}/email`,
    credentialsManager,
    'POST',
    request
  );

  if (status === 200) return true;
  throw UnexpectedResponse;
}

// Get functions

export function buildUserQueryParams(filters: UserFilters): string {
  const params = [];

  if (filters.page) params.push(`page=${filters.page}`);
  if (filters.limit) params.push(`limit=${filters.limit}`);
  if (filters.orderBy) {
    const orderByParams: string[] = [];
    Object.entries(filters.orderBy).forEach(([key, value]) => {
      orderByParams.push(`${key}:${value}`);
    });
    params.push(`order-by=${encodeURIComponent(orderByParams.join(','))}`);
  }

  return params.length ? `?${params.join('&')}` : '';
}

export async function getUsers(
  credentialsManager: CredentialsManager,
  filters?: UserFilters
): Promise<PaginatedResponse<User>> {
  const { data, metadata, status } = await fetchApiWithAuth<
    PaginatedMeta,
    User[]
  >(
    `/user${buildUserQueryParams(filters || defaultFilters)}`,
    credentialsManager,
    'GET'
  );

  if (status === 200) {
    return {
      data,
      page: metadata.pagination.page,
      limit: metadata.pagination.limit,
      total: metadata.pagination.total,
    };
  }
  throw UnexpectedResponse;
}

export async function getUser(
  credentialsManager: CredentialsManager,
  userId: string
): Promise<User> {
  const { data, status } = await fetchApiWithAuth<{}, User>(
    `/user/${userId}`,
    credentialsManager,
    'GET'
  );
  if (status === 200) {
    if (typeof data === 'undefined') throw MissingData;
    return data;
  }
  throw UnexpectedResponse;
}

export async function getUserEmails(
  credentialsManager: CredentialsManager,
  userId: string
): Promise<UserEmail[]> {
  const { data, status } = await fetchApiWithAuth<{}, UserEmail[]>(
    `/user/${userId}/email`,
    credentialsManager,
    'GET'
  );
  if (status === 200) {
    if (typeof data === 'undefined') throw MissingData;
    return data;
  }
  throw UnexpectedResponse;
}

export async function getUserSettings(
  credentialsManager: CredentialsManager,
  userId: string
): Promise<UserSettings> {
  const { data, status } = await fetchApiWithAuth<{}, UserSettings>(
    `/user/${userId}/settings`,
    credentialsManager,
    'GET'
  );
  if (status === 200) {
    if (typeof data === 'undefined') throw MissingData;
    return data;
  }
  throw UnexpectedResponse;
}

export async function getUserTeams(
  credentialsManager: CredentialsManager,
  userId: string
): Promise<Team[]> {
  const { data, status } = await fetchApiWithAuth<{}, { teams: Team[] }>(
    `/user/${userId}/teams`,
    credentialsManager,
    'GET'
  );

  if (status === 200) {
    if (typeof data === 'undefined') throw MissingData;
    const teamResponses = data.teams.map((partialTeam) =>
      getTeam(credentialsManager, partialTeam.id)
    );
    return Promise.all(teamResponses);
  }
  throw UnexpectedResponse;
}

// Update functions

export async function updateUser(
  credentialsManager: CredentialsManager,
  userId: string,
  request: UpdateUserRequest
): Promise<User> {
  const { data, status } = await fetchApiWithAuth<{}, User>(
    `/user/${userId}`,
    credentialsManager,
    'PATCH',
    request
  );

  if (status === 200) {
    if (typeof data === 'undefined') throw MissingData;
    return data;
  }
  throw UnexpectedResponse;
}

export async function updateUserSettings(
  credentialsManager: CredentialsManager,
  userId: string,
  request: UpdateUserSettingsRequest
): Promise<UserSettings> {
  const { data, status } = await fetchApiWithAuth<{}, UserSettings>(
    `/user/${userId}/settings`,
    credentialsManager,
    'PATCH',
    request
  );
  if (status === 200) {
    if (typeof data === 'undefined') throw MissingData;
    return data;
  }
  throw UnexpectedResponse;
}

// Delete functions

export async function deleteUser(
  credentialsManager: CredentialsManager,
  userId: string
): Promise<boolean> {
  const { status } = await fetchApiWithAuth<undefined, undefined>(
    `/user/${userId}`,
    credentialsManager,
    'DELETE'
  );
  if (status === 200) return true;
  throw UnexpectedResponse;
}

export async function deleteUserEmail(
  credentialsManager: CredentialsManager,
  userId: string,
  userEmailId: string
): Promise<boolean> {
  const { status } = await fetchApiWithAuth<undefined, undefined>(
    `/user/${userId}/emails/${userEmailId}`,
    credentialsManager,
    'DELETE'
  );
  if (status === 200) return true;
  throw UnexpectedResponse;
}

export async function resendEmail(emailId: string) {
  const { status } = await fetchApi(
    `/user/email/regenerate-token/${emailId}`,
    'POST'
  );
  if (status === 204) return true;
  throw UnexpectedResponse;
}

// validates the user's email, the code is sent to the user's email
export async function validateEmail(code: string) {
  const { status } = await fetchApi(`/user/email/validate/${code}`, 'POST');
  if (status === 204) return true;
  throw UnexpectedResponse;
}

// Hooks

export function useGetUsers(
  credentialsManager: CredentialsManager,
  filters?: UserFilters
): AsyncResponse<PaginatedResponse<User>> {
  const { data, error } = useSWR(
    `/user${buildUserQueryParams(filters || defaultFilters)}`,
    () => getUsers(credentialsManager, filters)
  );

  return {
    data,
    loading: !error && !data,
    error,
  };
}

export function useGetUserTeams(
  credentialsManager: CredentialsManager,
  userId: string
): AsyncResponse<Team[]> {
  const { data, error } = useSWR(`/user/${userId}/teams`, () =>
    getUserTeams(credentialsManager, userId)
  );

  return {
    data,
    loading: !error && !data,
    error,
  };
}
