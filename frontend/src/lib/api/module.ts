import {
  CredentialsManager,
  fetchApiWithAuth,
  UnexpectedResponse,
} from './api';
import { SortFilterType, TagFilterType } from '../common/filter';
import { Content } from './content';

export const MissingModuleId = new Error('Missing module id');

type ModuleType = 'challenge' | 'practice' | 'certification' | 'submodule';

export interface Module {
  id: string;
  name: string;
  description: string;
  tags: string[];
  type: ModuleType;
  progress: number;
  reward: number;
  image?: string;
  modules: Module[];
  contents: Content[];
}

// module without user progress
export interface EditionModule {
  id?: string;
  name: string;
  description: string;
  type: string;
  reward: number;
  tags: string[];
  modules: Module[];
  contents: Content[];
}

export const DEFAULT_IMAGE = '/module.png';

export const defaultModule = {
  id: '',
  name: '',
  description: '',
  tags: [],
  type: 'challenge' as ModuleType,
  progress: 0,
  reward: 0,
  image: DEFAULT_IMAGE,
  modules: [],
  contents: [],
};

export interface ModuleFilters {
  limit: number;
  offset: number;
  tags: TagFilterType;
  sort: SortFilterType;
}

function buildQuery(filters: ModuleFilters): string {
  let url = `/module?limit=${filters.limit}&offset=${filters.offset}`;

  const tags = Object.keys(filters.tags).reduce((prev, key) => {
    if (filters.tags[key]) return [...prev, key];
    return prev;
  }, [] as string[]);

  url += `&tags=[${tags.join(',')}]`;
  url += `&sort=${filters.sort}`;

  return url;
}

export function getModules(
  credentialsManager: CredentialsManager,
  filters?: ModuleFilters
) {
  const endpoint = filters ? buildQuery(filters) : '/module';

  return fetchApiWithAuth<{ total: number }, Module[]>(
    endpoint,
    credentialsManager
  );
}

/**
 * Fetches all the modules then filters by matching the search with the name field.
 * user parameter has no effect for now.
 * This function should change when the api permits searching.
 */
export async function searchModule(
  search: string,
  credentialsManager: CredentialsManager
) {
  const { data, status } = await fetchApiWithAuth<{}, Module[]>(
    '/module',
    credentialsManager
  );

  if (status !== 200) {
    throw UnexpectedResponse;
  }

  return data.filter((module) =>
    module.name.toLowerCase().includes(search.toLowerCase())
  );
}

export async function getModule(
  id: string,
  credentialsManager: CredentialsManager
) {
  const { data, status } = await fetchApiWithAuth<{}, Module>(
    `/module/${id}`,
    credentialsManager
  );

  if (status !== 200) {
    throw UnexpectedResponse;
  }

  return data;
}

function formatModule(module: EditionModule) {
  return {
    name: module.name,
    description: module.description,
    type: module.type,
    reward: module.reward,
    tags: module.tags,
    modules: module.modules.map((m) => m.id),
    contents: module.contents.map((c) => c.id),
    data: {},
  };
}

export async function createModule(
  module: EditionModule,
  credentialsManager: CredentialsManager
) {
  const moduleToSend = formatModule(module);

  const { data, status } = await fetchApiWithAuth<{}, EditionModule>(
    '/module',
    credentialsManager,
    'POST',
    moduleToSend
  );

  if (status !== 201) {
    throw UnexpectedResponse;
  }

  return data;
}

export async function updateModule(
  module: EditionModule,
  credentialsManager: CredentialsManager
) {
  if (!module.id) {
    throw MissingModuleId;
  }

  const moduleToSend = formatModule(module);

  const { data, status } = await fetchApiWithAuth<{}, EditionModule>(
    `/module/${module.id}`,
    credentialsManager,
    'PATCH',
    moduleToSend
  );

  if (status !== 200) {
    throw UnexpectedResponse;
  }

  return data;
}

export async function deleteModule(
  credentialsManager: CredentialsManager,
  id: string
): Promise<boolean> {
  const { status } = await fetchApiWithAuth<{}, void>(
    `/module/${id}`,
    credentialsManager,
    'DELETE'
  );

  if (status === 204) return true;
  throw UnexpectedResponse;
}
