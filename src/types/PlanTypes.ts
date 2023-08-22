import { Color } from './BaseTypes';

export interface RawCourseData {
  courses: Course[];
  legacy: Course[];
  majors: MajorData;
}

export interface MajorData {
  [key: string]: {
    display: string;
    color: Color;
  };
}

export interface PlanData {
  courses: Course[][][];
  bookmarks: BookmarksData;
}

export interface SerializedPlanData {
  courses?: SerializedPlanCourse[][][];
  bookmarks?: SerializedBookmarksData;
}

export function isSerializedPlanData(data: any): data is SerializedPlanData {
  if (!data) {
    return false;
  }

  return (
    Object.keys(data).length === 0 ||
    data.courses ||
    (data.bookmarks && typeof data.bookmarks === 'object')
  );
}

export interface SerializedCustomPlanCourse {
  title: string;
  subtitle?: string;
  units?: string;
  color?: Color;
}

export type SerializedPlanCourse = string | SerializedCustomPlanCourse;

export interface BookmarksData {
  noCredit: Set<Course>;
  forCredit: Set<Course>;
}

export interface SerializedBookmarksData {
  noCredit: string[];
  forCredit: string[];
}

export interface Course {
  id: string;
  name: string;
  units: string;
  repeatable: boolean;
  description: string;
  prereqs?: string;
  distros?: string;
  placeholder?: boolean;
  legacy?: boolean;
  custom?: boolean;
  color?: Color;
}

export interface CourseLocation {
  year: number;
  quarter: number;
}

export interface PlanModificationFunctions {
  addCourse: (course: Course, location: CourseLocation) => void;
  removeCourse: (course: Course, location: CourseLocation) => void;
  moveCourse: (
    course: Course,
    oldLocation: CourseLocation,
    newLocation: CourseLocation
  ) => void;
  addBookmark: (course: Course, forCredit: boolean) => void;
  removeBookmark: (course: Course, forCredit: boolean) => void;
}

export interface PlanSpecialFunctions {
  addSummerQuarter: (year: number) => void;
  removeSummerQuarter: (year: number) => void;
  addYear: () => void;
  clearData: (year?: number) => void;
}

export interface CourseDragItem {
  course: Course;
  from?: CourseLocation;
}

export interface CourseDropResult {
  moved: boolean;
}

export interface DragCollectProps {
  isDragging: boolean;
}

export interface DropCollectedProps {
  isOver: boolean;
}

export interface PlanDataCache {
  updated: string;
  data: RawCourseData;
}
