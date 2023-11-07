export interface RatingsViewData {
  course: string;
}

export interface CourseBasicRating {
  overall: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

export interface OverallRating {
  1: number;
  2: number;
  3: number;
  4: number;
  5: number;
}

export interface CommitmentRating {
  1: number;
  2: number;
  3: number;
  4: number;
  5: number;
}

export interface InstructorRating {
  1: number;
  2: number;
  3: number;
  4: number;
  5: number;
}

export interface GradeRating {
  1: number;
  2: number;
  3: number;
  4: number;
  5: number;
  6: number;
  7: number;
  8: number;
  9: number;
  10: number;
  11: number;
  12: number;
  13: number;
  14: number;
  15: number;
  16: number;
}

export interface SectionCourseRatings {
  overall?: OverallRating;
  commitment?: CommitmentRating;
  instructor?: InstructorRating;
  grade?: GradeRating;
}

export interface TermCourseRatings {
  [instructorName: string]: SectionCourseRatings;
}

export interface CourseRatings {
  [termId: string]: TermCourseRatings;
}
