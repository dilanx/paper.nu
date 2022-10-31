import { Component, ComponentProps } from 'react';
import { Mode } from '../utility/Constants';
import { AlertData } from './AlertTypes';
import {
  PlanData,
  PlanModificationFunctions,
  PlanSpecialFunctions,
} from './PlanTypes';
import {
  ScheduleData,
  ScheduleInteractions,
  ScheduleModificationFunctions,
} from './ScheduleTypes';
import { SearchDefaults, SearchModificationFunctions } from './SearchTypes';
import { SideCardData } from './SideCardTypes';

export interface AppState {
  data: PlanData;
  schedule: ScheduleData;
  switches: UserOptions;
  alertData?: AlertData;
  sideCardData?: SideCardData;
  f: PlanModificationFunctions;
  f2: PlanSpecialFunctions;
  sf: ScheduleModificationFunctions;
  ff: SearchModificationFunctions;
  loadingLogin: boolean;
  unsavedChanges: boolean;
  originalDataString: string;
  scheduleInteractions: ScheduleInteractions;
  searchDefaults?: SearchDefaults;
  about?: boolean;
  map?: boolean;
  latestTermId?: string;
}

export interface ReadUserOptions {
  notifications?: boolean;
  settings_tab?: string;
  mode?: Mode;
  active_plan_id?: string;
  active_schedule_id?: string;
  dark?: boolean;
  tab?: string;
  reduced_motion?: boolean;
  compact?: boolean;
  save_location_top?: boolean;
  quarter_units?: boolean;
  more_info?: boolean;
  show_times?: boolean;
  debug?: boolean;
  schedule_warnings?: boolean;
  course_info_details?: string;
  section_info_details?: string;
  minimap?: boolean;
}

export interface UserOptions {
  set: (key: keyof ReadUserOptions, val: any, save?: boolean) => void;
  get: ReadUserOptions;
}

export interface BaseProps {
  switches: UserOptions;
}

export type LoadMethods = 'None' | 'URL' | 'Account' | 'Storage' | 'TermChange';

export interface LoadResponse<T> {
  mode: Mode;
  data: T | 'malformed' | 'empty';
  activeId?: string;
  originalDataString: string;
  method: LoadMethods;
  latestTermId: string;
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

export type IconElement = (props: ComponentProps<'svg'>) => JSX.Element;

export type StringMap = { [key: string]: string };

//export type AppType = React.Component<{}, AppState>;

export interface AppType extends Component<{}, AppState> {
  closeSideCard(): void;
  showAlert(alertData: AlertData): void;
}

export type TextValidator = (value: string) => boolean;

export interface DataMapInformation {
  latest: string;
  plan: string;
  terms: {
    [term: string]: {
      name: string;
      updated: string;
    };
  };
}
