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
