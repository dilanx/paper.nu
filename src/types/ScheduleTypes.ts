export interface Time {
  h: number;
  m: number;
}

export interface ScheduleData {
  termId?: string;
  schedule: ScheduleDataMap;
  bookmarks: ScheduleBookmarks;
}

export interface ScheduleDataMap {
  [section_id: string]: ScheduleSection;
}

export interface ValidScheduleDataMap {
  [section_id: string]: ValidScheduleSection;
}

export type ScheduleBookmarks = ScheduleCourse[];

export interface ScheduleCourse {
  course_id: string;
  school: string;
  title: string;
  subject: string;
  number: string;
  sections: ScheduleSection[];
  hide_section_ids?: string[];
}

export interface ScheduleSectionInstructor {
  name?: string;
  phone?: string;
  campus_address?: string;
  office_hours?: string;
  bio?: string;
  url?: string;
}

export interface ScheduleSection {
  section_id: string;
  instructors?: ScheduleSectionInstructor[];
  title: string;
  subject: string;
  number: string;
  section: string;
  meeting_days?: string;
  start_time?: Time;
  end_time?: Time;
  room?: string;
  start_date?: string;
  end_date?: string;
  component: string;
  preview?: boolean;
}

export interface ValidScheduleSection extends ScheduleSection {
  start_date: string;
  end_date: string;
  start_time: Time;
  end_time: Time;
  meeting_days: string;
}

export function isValidScheduleSection(
  section: ScheduleSection | undefined
): section is ValidScheduleSection {
  return (
    !!section &&
    !!section.start_date &&
    !!section.end_date &&
    !!section.start_time &&
    !!section.end_time &&
    !!section.meeting_days
  );
}

export interface RawSchoolData {
  locations: ScheduleLocations;
  schools: UniversitySchools;
}

export interface UniversitySchools {
  [symbol: string]: UniversitySchool;
}

export interface UniversitySchool {
  name: string;
  subjects: UniversitySubject[];
}

export interface UniversitySubject {
  symbol: string;
  name: string;
}

export interface ScheduleLocations {
  [building: string]: ScheduleLocation | null;
}

export interface ScheduleLocation {
  lat: number;
  lon: number;
}

export interface ScheduleDate {
  y: number;
  m: number;
  d: number;
}

export interface ScheduleHourMap {
  [hour: number]: ValidScheduleSection[];
}

export interface ScheduleLayoutMap {
  [sectionId: string]: { i: number; l: number };
}

export interface ScheduleInteraction<T> {
  get?: T;
  set: (value: T) => void;
  clear: () => void;
}
export interface ScheduleInteractions {
  hoverSection: ScheduleInteraction<string>;
  hoverDelete: ScheduleInteraction<boolean>;
  previewSection: ScheduleInteraction<ScheduleSection>;
  multiClear: (interactions: (keyof ScheduleInteractions)[]) => void;
}

export interface ScheduleModificationFunctions {
  addSection: (section: ScheduleSection) => void;
  removeSection: (section: ScheduleSection) => void;
  addScheduleBookmark: (course: ScheduleCourse) => void;
  removeScheduleBookmark: (course: ScheduleCourse) => void;
}

export interface ScheduleDataCache {
  termId: string;
  updated: string;
  data: ScheduleCourse[];
}
