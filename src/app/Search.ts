import ShortcutsJson from '@/data/shortcuts.json';
import { Course } from '@/types/PlanTypes';
import { ScheduleCourse, ScheduleData } from '@/types/ScheduleTypes';
import {
  FilterOptions,
  SearchError,
  SearchQuery,
  SearchResults,
  SearchShortcut,
  SearchShortcuts,
} from '@/types/SearchTypes';
import { Mode } from '@/utility/Constants';
import {
  courseMatchesFilter,
  getCourseSubjectDisplayName,
  getPlanCourseData,
} from './Plan';
import { getScheduleCourseData, sectionMatchesFilter } from './Schedule';

// TODO might be time to run search on the server side, this isn't sustainable
// this can also be pretty optimized if someone wants to do it lmao

export const LIGHT_PLAN_SEARCH_RESULT_LIMIT = 25;
export const LIGHT_SCHEDULE_SEARCH_RESULT_LIMIT = 25;
export const HEAVY_PLAN_SEARCH_RESULT_LIMIT = 75;
export const HEAVY_SCHEDULE_SEARCH_RESULT_LIMIT = 50;

const shortcuts = ShortcutsJson as SearchShortcuts;

function cleanQuery(query: string) {
  return query.toLowerCase().replace(/_/g, ' ');
}

function filterBelongsTo(option: keyof FilterOptions, mode: Mode) {
  switch (option) {
    case 'subject':
    case 'distros':
    case 'disciplines':
      return true;
    case 'unitGeq':
    case 'unitLeq':
    case 'include':
      return mode === Mode.PLAN;
    case 'meetingDays':
    case 'startAfter':
    case 'startBefore':
    case 'endAfter':
    case 'endBefore':
    case 'allAvailability':
    case 'components':
    case 'instructor':
    case 'location':
      return mode === Mode.SCHEDULE;
    default:
      return false;
  }
}

export function filterExists(filter: FilterOptions | undefined, mode: Mode) {
  return (
    filter &&
    Object.keys(filter).filter((f) => {
      if (mode === Mode.PLAN && f === 'include') {
        return false;
      }

      return filterBelongsTo(f as keyof FilterOptions, mode);
    }).length > 0
  );
}

function prepareQuery(query: string): SearchQuery {
  query = cleanQuery(query);
  let terms = [query];

  const firstWord = query.split(' ')[0];
  let shortcut: SearchShortcut | undefined;
  if (shortcuts[firstWord]) {
    const sc = shortcuts[firstWord];
    const remainder = query.substring(firstWord.length + 1);
    terms = sc.map((s) => `${cleanQuery(s)} ${remainder}`);
    shortcut = {
      replacing: firstWord.toUpperCase(),
      with: sc.join(', '),
    };
  }

  return { terms, shortcut };
}

function checkInvalidQueryTerms(terms: string[]) {
  for (const term of terms) {
    if (term.length === 0) {
      return 'no_query';
    }
    if (term.length < 3) {
      return 'too_short';
    }
  }
}

function isValidRegex(pattern: string): [boolean, RegExp | null] {
  try {
    const regex = new RegExp(pattern, 'i');
    return [true, regex];
  } catch {
    return [false, null];
  }
}

function getSearchRegex(term: string): RegExp | null {
  const pattern = term
    .replace(/([.*+?^=!:${}()|[]\/\\])/g, '\\$1')
    .replace(/x/g, '[\\dx]');

  const [isValid, regex] = isValidRegex(pattern);
  return isValid ? regex : null;
}

function fullId(subject: string, ...number: string[]) {
  const displayName = getCourseSubjectDisplayName(subject);
  return `${displayName} ${subject} ${number.join(' ')}`;
}

function scheduleCourseId(course: ScheduleCourse) {
  return `${course.subject} ${course.number}`;
}

function search(searchThrough: string, term: string) {
  const st = searchThrough.toLowerCase().replace(/_/g, ' ');

  // true = valid regex, match; false = valid regex, no match; 'invalid_regex' = invalid regex
  const regexStateList: Array<boolean | 'invalid_regex'> = term
    .split(' ')
    .map((t) => {
      const regex = getSearchRegex(t);
      return regex ? regex.test(st) : 'invalid_regex';
    });

  const isAllRegexMatches = regexStateList.every((t) => t === true);
  const isSomeInvalidRegex = regexStateList.some((t) => t === 'invalid_regex');

  return isSomeInvalidRegex ? 'invalid_regex' : isAllRegexMatches;
}

export function searchPlan(
  query: string,
  resultLimit: number,
  filter?: FilterOptions
): SearchResults<Course> | SearchError {
  const { terms, shortcut } = prepareQuery(query);
  const useFilters = filterExists(filter, Mode.PLAN);
  const courseData = getPlanCourseData();

  if (!courseData) {
    if (query.length === 0) {
      return 'no_query';
    }
    return 'not_loaded';
  }

  if (!useFilters) {
    const invalidTerms = checkInvalidQueryTerms(terms);
    if (invalidTerms) {
      return invalidTerms;
    }
  }

  let courseIdResults: Course[] = [];
  let courseNameResults: Course[] = [];

  const checkCourse = (course: Course) => {
    if (useFilters && !courseMatchesFilter(course, filter)) {
      return;
    }

    const [subject, ...rest] = course.id.split(' ');
    const id = fullId(subject, ...rest);

    for (const term of terms) {
      const searchIdResult = search(id, term);
      const searchCourseResult = search(course.name, term);

      if (
        searchIdResult == 'invalid_regex' ||
        searchCourseResult == 'invalid_regex'
      ) {
        return 'invalid_regex';
      }

      if (searchIdResult) {
        courseIdResults.push(course);
      } else if (searchCourseResult) {
        courseNameResults.push(course);
      }
    }
  };

  for (const course of courseData.courses) {
    const result = checkCourse(course);
    if (result == 'invalid_regex') {
      return 'invalid_regex';
    }
  }

  if (filter?.include?.includes('Legacy Courses')) {
    courseData.legacy.forEach(checkCourse);
  }

  const total = courseIdResults.length + courseNameResults.length;
  if (total === 0) return 'no_results';

  let limitExceeded = false;
  if (total > resultLimit) {
    limitExceeded = true;
    if (courseIdResults.length > resultLimit) {
      courseIdResults = courseIdResults.slice(0, resultLimit);
      courseNameResults = [];
    } else {
      courseNameResults = courseNameResults.slice(
        0,
        resultLimit - courseIdResults.length
      );
    }
  }

  courseIdResults.sort((a, b) => a.id.localeCompare(b.id));
  courseNameResults.sort((a, b) => a.name.localeCompare(b.name));

  return {
    results: courseIdResults.concat(courseNameResults),
    shortcut,
    limitExceeded: limitExceeded ? total - resultLimit : undefined,
  };
}

export function searchSchedule(
  query: string,
  schedule: ScheduleData,
  resultLimit: number,
  filter?: FilterOptions
): SearchResults<ScheduleCourse> | SearchError {
  const { terms, shortcut } = prepareQuery(query);
  const useFilters = filterExists(filter, Mode.SCHEDULE);
  const courseData = getScheduleCourseData();

  if (!courseData) {
    if (query.length === 0) {
      return 'no_query';
    }
    return 'not_loaded';
  }

  if (!useFilters) {
    const invalidTerms = checkInvalidQueryTerms(terms);
    if (invalidTerms) {
      return invalidTerms;
    }
  }

  let courseIdResults: ScheduleCourse[] = [];
  let courseNameResults: ScheduleCourse[] = [];

  const checkCourse = (course: ScheduleCourse) => {
    course.hide_section_ids = [];
    if (useFilters) {
      for (const section of course.sections) {
        if (!sectionMatchesFilter(section, schedule, filter)) {
          course.hide_section_ids.push(section.section_id);
        }
      }

      if (course.hide_section_ids.length === course.sections.length) {
        return;
      }
    }

    const id = fullId(course.subject, course.number);
    for (const term of terms) {
      const searchIdResult = search(id, term);
      const searchCourseResult = search(course.title, term);
      const isSectionsContainsInvalidRegex = course.sections.some(
        (s) => s.topic && search(s.topic, term) == 'invalid_regex'
      );

      if (
        searchIdResult == 'invalid_regex' ||
        searchCourseResult == 'invalid_regex' ||
        isSectionsContainsInvalidRegex
      ) {
        return 'invalid_regex';
      }

      if (searchIdResult) {
        courseIdResults.push(course);
      } else if (
        searchCourseResult ||
        course.sections.some((s) => s.topic && search(s.topic, term))
      ) {
        courseNameResults.push(course);
      }
    }
  };

  for (const course of courseData) {
    const result = checkCourse(course);
    if (result == 'invalid_regex') {
      return 'invalid_regex';
    }
  }

  const total = courseIdResults.length + courseNameResults.length;
  if (total === 0) return 'no_results';

  let limitExceeded = false;
  if (total > resultLimit) {
    limitExceeded = true;
    if (courseIdResults.length > resultLimit) {
      courseIdResults = courseIdResults.slice(0, resultLimit);
      courseNameResults = [];
    } else {
      courseNameResults = courseNameResults.slice(
        0,
        resultLimit - courseIdResults.length
      );
    }
  }

  courseIdResults.sort((a, b) =>
    scheduleCourseId(a).localeCompare(scheduleCourseId(b))
  );
  courseNameResults.sort((a, b) =>
    scheduleCourseId(a).localeCompare(scheduleCourseId(b))
  );

  return {
    results: courseIdResults.concat(courseNameResults),
    shortcut,
    limitExceeded: limitExceeded ? total - resultLimit : undefined,
  };
}
