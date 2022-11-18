import useSWR from 'swr';
import {
  AsyncResponse,
  CredentialsManager,
  fetchApiWithAuth,
  UnexpectedResponse,
} from './api';
import { PaginatedMeta, PaginatedResponse } from './pagination';

// Response structures (models)
export interface TeamMember {
  id: string;
  username: string;
  role: 'captain' | 'member';
  points: number;
  rank?: number;
}

export interface Team {
  id: string;
  name: string;
  description: string;
  rank?: number;
  points?: number;
  members: TeamMember[];
}

export const defaultTeam = {
  id: '',
  name: '',
  description: '',
  members: [],
};

// Request structure
export interface TeamRequest {
  name: string;
  description: string;
}

export interface TeamMemberRequest {
  userId: string;
}

// Query filters
export interface TeamFilters {
  page?: number;
  limit?: number;
  orderBy?: number;
  name?: string;
}

// Utils
export default function calcTeamPoints(team: Team): number {
  return team.members.reduce((acc, member) => acc + member.points, 0);
}

function buildUrl(filters?: TeamFilters): string {
  const params = [];

  if (filters?.page) params.push(`page=${filters.page}`);
  if (filters?.limit) params.push(`limit=${filters.limit}`);
  if (filters?.orderBy) params.push(`order-by=${filters.orderBy}`);
  if (filters?.name) params.push(`name=${filters.name}`);

  const query = params.length ? `?${params.join('&')}` : '';
  return `/team${query}`;
}

// API calls
export async function createTeam(
  credentialsManager: CredentialsManager,
  request: TeamRequest
): Promise<Team> {
  const { data, status } = await fetchApiWithAuth<{}, Team>(
    '/team',
    credentialsManager,
    'POST',
    request
  );

  if (status !== 201) throw UnexpectedResponse;
  return data;
}

export async function getTeams(
  credentialsManager: CredentialsManager,
  filters?: TeamFilters
): Promise<PaginatedResponse<Team>> {
  const { data, metadata, status } = await fetchApiWithAuth<
    PaginatedMeta,
    Team[]
  >(buildUrl(filters), credentialsManager);

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

export async function getTeam(
  credentialsManager: CredentialsManager,
  teamId: string
): Promise<Team> {
  const { data, status } = await fetchApiWithAuth<{}, Team>(
    `/team/${teamId}`,
    credentialsManager
  );

  if (status !== 200) throw UnexpectedResponse;
  return data;
}

export async function updateTeam(
  credentialsManager: CredentialsManager,
  teamId: string,
  request: TeamRequest
): Promise<Team> {
  const { data, status } = await fetchApiWithAuth<{}, Team>(
    `/team/${teamId}`,
    credentialsManager,
    'PATCH',
    request
  );

  if (status !== 200) throw UnexpectedResponse;
  return data;
}

export async function deleteTeam(
  credentialsManager: CredentialsManager,
  teamId: string
): Promise<boolean> {
  const { status } = await fetchApiWithAuth<{}, void>(
    `/team/${teamId}`,
    credentialsManager,
    'DELETE'
  );

  if (status !== 204) throw UnexpectedResponse;
  return true;
}

export async function addTeamMember(
  credentialsManager: CredentialsManager,
  teamId: string,
  request: TeamMemberRequest
): Promise<TeamMember> {
  const { data, status } = await fetchApiWithAuth<{}, TeamMember>(
    `/team/${teamId}/members`,
    credentialsManager,
    'POST',
    request
  );

  if (status !== 201) throw UnexpectedResponse;
  return data;
}

export async function removeTeamMember(
  credentialsManager: CredentialsManager,
  teamId: string,
  request: TeamMemberRequest
): Promise<boolean> {
  const { status } = await fetchApiWithAuth<{}, void>(
    `/team/${teamId}/members`,
    credentialsManager,
    'DELETE',
    request
  );

  if (status !== 200) throw UnexpectedResponse;
  return true;
}

// Hooks
export function useGetTeams(
  credentialsManager: CredentialsManager,
  filters?: TeamFilters
): AsyncResponse<PaginatedResponse<Team>> {
  const { data, error } = useSWR(buildUrl(filters), () =>
    getTeams(credentialsManager, filters)
  );

  return {
    data,
    loading: !error && !data,
    error,
  };
}

export function useGetTeam(
  credentialsManager: CredentialsManager,
  teamId?: string
): AsyncResponse<Team> {
  const { data, error } = useSWR(`/team/${teamId}`, () =>
    teamId ? getTeam(credentialsManager, teamId) : undefined
  );

  return {
    data,
    loading: !error && !data,
    error,
  };
}
