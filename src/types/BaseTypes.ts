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
}

export interface ReadUserOptions {
  notifications?: boolean;
  settings_tab?: string;
  mode?: Mode;
  schedule_image_watermark?: boolean;
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
}

export interface UserOptions {
  set: (key: keyof ReadUserOptions, val: any, save?: boolean) => void;
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
  termId?: string;
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

export type IconElement = (props: React.ComponentProps<'svg'>) => JSX.Element;

export type StringMap = { [key: string]: string };

export type AppType = React.Component<{}, AppState>;

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
