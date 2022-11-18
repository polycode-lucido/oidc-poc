import {
  CredentialsManager,
  fetchApiWithAuth,
  UnexpectedResponse,
} from './api';

// when in admin we always have the text
export interface Item {
  id: string;
  cost: number;
  type: string;
  data: {
    text: string;
  };
}

export interface UserItem {
  id: string;
  cost: number;
  type: string;
  data: {
    text: string | null;
  };
}

// admin access to get the text of items
export async function getItem(id: string, creds: CredentialsManager) {
  const { data, status } = await fetchApiWithAuth<{}, Item>(
    `/item/${id}`,
    creds,
    'GET'
  );
  if (status === 200) return data;
  throw UnexpectedResponse;
}

export async function getUserItem(id: string, creds: CredentialsManager) {
  const { data, status } = await fetchApiWithAuth<{}, UserItem>(
    `/item/bought/${id}`,
    creds
  );

  if (status !== 200) {
    throw UnexpectedResponse;
  }
  return data;
}

export async function buyItem(id: string, creds: CredentialsManager) {
  const { data, status } = await fetchApiWithAuth<{}, UserItem>(
    `/item/buy/${id}`,
    creds,
    'POST'
  );

  if (status !== 201) {
    throw UnexpectedResponse;
  }
  return data;
}

export async function createItem(
  cost: number,
  type: string,
  text: string,
  creds: CredentialsManager
) {
  const { data, status } = await fetchApiWithAuth<{}, Item>(
    '/item',
    creds,
    'POST',
    {
      cost,
      type,
      data: {
        text,
      },
    }
  );

  if (status !== 201) {
    throw UnexpectedResponse;
  }
  return data;
}

export async function updateItem(
  id: string,
  cost: number,
  type: string,
  text: string,
  creds: CredentialsManager
) {
  const { data, status } = await fetchApiWithAuth<{}, Item>(
    `/item/${id}`,
    creds,
    'PATCH',
    {
      cost,
      type,
      data: {
        text,
      },
    }
  );

  if (status !== 200) {
    throw UnexpectedResponse;
  }
  return data;
}

export async function deleteItem(id: string, creds: CredentialsManager) {
  const { data, status } = await fetchApiWithAuth<{}, Item>(
    `/item/${id}`,
    creds,
    'DELETE'
  );

  if (status !== 200) {
    throw UnexpectedResponse;
  }
  return data;
}
