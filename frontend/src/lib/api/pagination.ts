import { useState } from 'react';

// Types
export interface PaginatedMeta {
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
}

// Filters
export interface PaginatedFilter {
  page?: number;
  limit?: number;
}

// Hooks
export function usePagination(defaultPage: number = 1) {
  const [page, setPage] = useState(defaultPage);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);

  return {
    page,
    setPage,
    limit,
    setLimit,
    total,
    setTotal,
  };
}
