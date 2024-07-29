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

export interface CourseRatings {
  overall?: OverallRating;
  commitment?: CommitmentRating;
  grade?: GradeRating;
}

export interface CourseRating {
  overall?: number;
  commitment?: number;
  grade?: number;
}

export interface SummaryRatingResponse {
  overall: OverallRating;
}

export interface RateResponse {
  success?: boolean;
}

export interface RatingInfo {
  ratings: CourseRatings;
  rated: boolean;
}

export interface CachedRatings {
  timestamp: number;
  summary?: OverallRating;
  data?: RatingInfo;
}

export type RatingsView = (ratingsData: RatingsViewData) => void;

export interface RatingsObject<T> {
  overall: T;
  commitment: T;
  grade: T;
}

/** [average, total] */
export type RatingCalculations = [number, number];
