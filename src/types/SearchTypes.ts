import { Time } from './ScheduleTypes';

export interface SearchResults<T> {
  results: T[];
  shortcut?: SearchShortcut;
  limitExceeded?: number;
}

export interface SearchShortcut {
  replacing: string;
  with: string;
}

export type SearchError = 'no_query' | 'too_short' | 'no_results';

export interface SearchFilter {
  get: FilterOptions;
  set: (filter: Partial<FilterOptions>, returnToNormalMode?: boolean) => void;
}

export interface FilterOptions {
  subject?: string;
  startAfter?: Time;
  startBefore?: Time;
  endAfter?: Time;
  endBefore?: Time;
  meetingDays?: string[];
  components?: string[];
  instructor?: string;
  location?: string;
}

export type FilterBadgeName =
  | 'subject'
  | 'start'
  | 'end'
  | 'meeting days'
  | 'components'
  | 'instructor'
  | 'location';

export interface FilterDisplay {
  value: string;
  relatedKeys: (keyof FilterOptions)[];
}

export type FilterDisplayMap = {
  [key in FilterBadgeName]?: FilterDisplay;
};

export interface SearchResultsElements {
  results?: JSX.Element[];
  placeholder?: JSX.Element[];
  shortcut?: SearchShortcut;
}

export interface SearchModificationFunctions {
  set: (query: string, current: string | undefined) => void;
}

export interface SearchDefaults {
  query?: string;
  scheduleCurrent?: string;
}
