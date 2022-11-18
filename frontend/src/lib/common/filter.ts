export type StateFilterType = {
  done: boolean;
  started: boolean;
  [key: string]: boolean;
};

export type SortFilterType = 'name' | 'date' | 'completion';

export type TagFilterType = {
  javascript: boolean;
  rust: boolean;
  java: boolean;
  python: boolean;
  [key: string]: boolean;
};
