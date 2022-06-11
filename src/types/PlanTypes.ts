import { Color } from './BaseTypes';

export interface RawCourseData {
    courses: Course[];
    majors: { [key: string]: { id: string; display: string; color: Color } };
    major_ids: { [key: string]: string };
    shortcuts: { [key: string]: string[] };
}

export interface PlanData {
    courses: Course[][][];
    bookmarks: BookmarksData;
}

export interface BookmarksData {
    noCredit: Set<Course>;
    forCredit: Set<Course>;
}

export interface Course {
    id: string;
    name: string;
    units: string;
    repeatable: boolean;
    description: string;
    career: string;
    nu_id: string;
    offered?: string;
    prereqs?: string;
    distros?: string;
    placeholder?: boolean;
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
    addFavorite: (course: Course, forCredit: boolean) => void;
    removeFavorite: (course: Course, forCredit: boolean) => void;
}

export interface PlanSpecialFunctions {
    addSummerQuarter: (year: number) => void;
    addYear: () => void;
    clearData: () => void;
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

export interface SearchResults {
    results: Course[];
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
