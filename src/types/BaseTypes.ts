import { Mode } from '../utility/Constants';

export type UserOptionValue = boolean | string | number | undefined;

export interface ReadUserOptions {
    [key: string]: UserOptionValue;
}

export interface UserOptions {
    set: (key: string, val: UserOptionValue, save?: boolean) => void;
    get: ReadUserOptions;
}

export interface BaseProps {
    switches: UserOptions;
}

export type LoadMethods = 'None' | 'URL' | 'Account' | 'Storage';

export interface LoadResponse<T> {
    mode: Mode;
    data: T | 'malformed' | 'empty';
    activeId?: string;
    originalDataString: string;
    method: LoadMethods;
}

export type Color =
    | 'slate'
    | 'gray'
    | 'zinc'
    | 'neutral'
    | 'stone'
    | 'red'
    | 'orange'
    | 'amber'
    | 'yellow'
    | 'lime'
    | 'green'
    | 'emerald'
    | 'teal'
    | 'cyan'
    | 'sky'
    | 'blue'
    | 'indigo'
    | 'violet'
    | 'purple'
    | 'fuchsia'
    | 'pink'
    | 'rose';

export type ColorMap = { [key: string]: Color };

export interface SearchResults<T> {
    results: T[];
    shortcut?: SearchShortcut;
    limitExceeded?: number;
}

export interface SearchShortcut {
    replacing: string;
    with: string;
}

export type SearchError = 'too_short' | 'no_results';

export interface SearchResultsElements {
    results: JSX.Element[];
    shortcut?: SearchShortcut;
}
