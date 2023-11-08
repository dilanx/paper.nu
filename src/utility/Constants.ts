export enum Mode {
  PLAN = 0,
  SCHEDULE = 1,
}

export enum SearchMode {
  NORMAL = 0,
  BROWSE = 1,
}

export const Days = ['Mo', 'Tu', 'We', 'Th', 'Fr'];
export const DayMap: { [key: string]: number } = {
  Mo: 0,
  Tu: 1,
  We: 2,
  Th: 3,
  Fr: 4,
};

export const Components = ['LEC', 'DIS', 'LAB', 'SEM', 'PED'];
export const ComponentMap: { [key: string]: number } = {
  LEC: 0,
  DIS: 1,
  LAB: 2,
  SEM: 3,
  PED: 4,
};

export const Distros = ['NS', 'FS', 'SBS', 'HS', 'EV', 'LFA', 'IS'];
export const DistroMap: { [key: string]: number } = {
  NS: 1,
  FS: 2,
  SBS: 3,
  HS: 4,
  EV: 5,
  LFA: 6,
  IS: 7,
};

export const Disciplines = [
  'FD-NS',
  'FD-EDR',
  'FD-SBS',
  'FD-HS',
  'FD-EET',
  'FD-LA',
  'FD-I',
];
export const DisciplineMap: { [key: string]: number } = {
  'FD-NS': 1,
  'FD-EDR': 2,
  'FD-SBS': 3,
  'FD-HS': 4,
  'FD-EET': 5,
  'FD-LA': 6,
  'FD-I': 7,
};

export const TIME_COMMITMENT_LEVELS = ['0-3', '4-8', '9-14', '14-20', '20+'];
