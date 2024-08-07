import { Mode } from '@/utility/Constants';
import { Component, ComponentProps } from 'react';
import {
  RecentShareItem,
  RecentShareModificationFunctions,
} from './AccountTypes';
import { Alert, AlertData } from './AlertTypes';
import { Course, PlanData, PlanModificationFunctions } from './PlanTypes';
import { RatingsView, RatingsViewData } from './RatingTypes';
import {
  ScheduleData,
  ScheduleInteractions,
  ScheduleModificationFunctions,
  ScheduleSection,
} from './ScheduleTypes';
import { SearchDefaults, SearchModificationFunctions } from './SearchTypes';
import { SideCard, SideCardData } from './SideCardTypes';

export interface AppState {
  data: PlanData;
  schedule: ScheduleData;
  userOptions: UserOptions;
  alertData?: AlertData;
  sideCardData?: SideCardData;
  f: PlanModificationFunctions;
  sf: ScheduleModificationFunctions;
  ff: SearchModificationFunctions;
  rf: RecentShareModificationFunctions;
  loadingLogin: boolean;
  saveState: SaveState;
  saveTimeoutId?: number;
  scheduleInteractions: ScheduleInteractions;
  searchDefaults?: SearchDefaults;
  about?: boolean;
  banner?: boolean;
  map?: boolean;
  ratings?: RatingsViewData;
  latestTermId?: string;
  contextMenuData?: ContextMenuData;
  recentShare?: RecentShareItem[];
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
  minimap?: boolean;
  notes?: boolean;
  unsaved_notes?: boolean;
  notice_dismiss?: string;
  time_bar?: boolean;
  more_results?: boolean;
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
  method: LoadMethods;
  latestTermId: string;
  error?: string;
  sharedCourse?: Course;
  sharedSection?: ScheduleSection;

  // RecentShareItem if loaded
  // string of share code if not failed to load
  recentShare?: RecentShareItem | string;
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

export interface AppType extends Component<Record<string, never>, AppState> {
  closeSideCard(): void;
  showAlert(alertData: AlertData): void;
  initialize(callback: () => void, options?: SaveDataOptions): void;
  appRef: React.RefObject<HTMLDivElement>;
}

export type TextValidator = (value: string) => boolean;

export interface DataMapInformation {
  latest: string;
  subjects: string;
  plan: string;
  terms: {
    [term: string]: {
      name: string;
      updated: string;
      start: string;
      end: string;
    };
  };
}

export interface ChangeLogPreviewInformation {
  items: {
    title: string;
    description?: string;
  }[];
  link?: {
    text: string;
    url: string;
  };
}

export interface ContextMenuData {
  name: string;
  x: number;
  y: number;
  mode?: 'left' | 'right';
  sm?: boolean;
  topText?: string;
  items: ContextMenuItem[];
}

export interface ContextMenuItem {
  text: string;
  icon: IconElement;
  onClick: () => void;
  description?: string;
  disabled?: boolean;
  disabledReason?: string;
  danger?: boolean;
}

export interface ContextMenu {
  (contextMenuData: ContextMenuData): void;
}

export type InfoSetValFn = () => Promise<string>;
export type InfoSetItem<T> = [string, T];
export type InfoSetData<T = string | InfoSetValFn> = InfoSetItem<T>[];

export interface SaveDataOptions {
  hash?: string;
  changeTerm?: string;
  showCourse?: string | null;
  showSection?: string | null;
}

export type UniversityQuarter = 'Fall' | 'Winter' | 'Spring' | 'Summer';

export interface UniversitySchools {
  [symbol: string]: UniversitySchool;
}

export interface UniversitySchool {
  name?: string;
  subjects: UniversitySubject[];
}

export interface UniversitySubject {
  symbol: string;
  name: string;
}

export interface UniversityLocations {
  [building: string]: UniversityLocation | null;
}

export interface UniversityLocation {
  lat: number;
  lon: number;
}

export interface OrganizedTerms {
  [year: string]: {
    [quarter: string]: string | null;
  };
}

/**
 * The state of auto save
 * - idle: no changes have been made
 * - start: changes were just made
 * - wait: grace period before saving to batch changes
 * - save: saving changes
 * - error: error occurred while saving
 */
export type SaveState = 'idle' | 'start' | 'wait' | 'save' | 'error';

export interface SubjectData {
  [subject: string]: {
    color?: Color;
    display?: string;
    schools?: string[];
  };
}

export interface SubjectDataCache {
  updated: string;
  data: SubjectData;
}

export interface SubjectsAndSchools {
  subjects: SubjectData;
  schools: UniversitySchools;
}

export interface BannerData {
  id: string;
  content: React.ReactNode;
  gradient?: number;
}

export interface AppContext {
  version: string;
  userOptions: UserOptions;
  activeContextMenu: string | undefined;
  alert: Alert;
  sideCard: SideCard;
  contextMenu: ContextMenu;
  ratingsView: RatingsView;
  mapView: () => void;
}

export interface DataContext {
  plan: PlanData;
  schedule: ScheduleData;
}

export interface ModificationContext {
  planModification: PlanModificationFunctions;
  scheduleModification: ScheduleModificationFunctions;
  searchModification: SearchModificationFunctions;
  recentShareModification: RecentShareModificationFunctions;
}
