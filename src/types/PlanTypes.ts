import { Color } from './BaseTypes';

export interface RawCourseData {
  courses: Course[];
  legacy: Course[];
  topics: CourseTopicsData;
}

export type CourseTopic = [string, string[]];

export type CourseTopics = CourseTopic[];

export interface CourseTopicsData {
  [id: string]: CourseTopics;
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
    (data.bookmarks && !Array.isArray(data.bookmarks))
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
  repeatable?: boolean;
  description?: string;
  prereqs?: string;
  distros?: string;
  disciplines?: string;
  school?: string;
  terms?: string[];
  legacy?: boolean;
  custom?: boolean;
  color?: Color;

  // instance data
  iuid?: string;
  itopic?: string | null;
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
  editCourse: (
    courseInstanceUid: string,
    course: Course,
    location: CourseLocation
  ) => void;
  addBookmark: (course: Course, forCredit: boolean) => void;
  removeBookmark: (course: Course, forCredit: boolean) => void;
  putCustomCourse: (location: CourseLocation, courseToEdit?: Course) => void;
  addSummerQuarter: (year: number) => void;
  removeSummerQuarter: (year: number) => void;
  addYear: () => void;
  removeYear: (year: number) => void;
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
