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

export type SearchError =
  | 'no_query'
  | 'too_short'
  | 'no_results'
  | 'not_loaded';

export interface SearchFilter {
  get: FilterOptions;
  set: (filter: Partial<FilterOptions>, returnToNormalMode?: boolean) => void;
}

export interface FilterOptions {
  subject?: string;
  meetingDays?: string[];
  startAfter?: Time;
  startBefore?: Time;
  endAfter?: Time;
  endBefore?: Time;
  allAvailability?: string[];
  components?: string[];
  instructor?: string;
  location?: string;
  distros?: string[];
  unitGeq?: number;
  unitLeq?: number;
  include?: string[];
}

export type FilterBadgeName =
  | 'subject'
  | 'meeting days'
  | 'start'
  | 'end'
  | 'time slots'
  | 'components'
  | 'instructor'
  | 'location'
  | 'distros'
  | 'units'
  | 'include';

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
  set: (query: string, current?: string) => void;
}

export interface SearchDefaults {
  query?: string;
  scheduleCurrent?: string;
  updated?: boolean;
}

export interface SearchShortcuts {
  [key: string]: string[];
}

export interface SearchQuery {
  terms: string[];
  shortcut?: SearchShortcut;
}
