export enum Mode {
  PLAN = 0,
  SCHEDULE = 1,
}

export enum SearchMode {
  NORMAL = 0,
  BROWSE = 1,
  ADVANCED = 2,
}

export const Days = ['Mo', 'Tu', 'We', 'Th', 'Fr'];

export const DayMap: { [key: string]: number } = {
  Mo: 0,
  Tu: 1,
  We: 2,
  Th: 3,
  Fr: 4,
};

export const ComponentMap: { [key: string]: number } = {
  LEC: 0,
  DIS: 1,
  LAB: 2,
  SEM: 3,
  PED: 4,
};
