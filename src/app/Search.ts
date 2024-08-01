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
import { courseMatchesFilter, getPlanCourseData } from './Plan';
import { getScheduleCourseData, sectionMatchesFilter } from './Schedule';

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

function getSearchRegex(term: string) {
  const pattern = term
    .replace(/([.*+?^=!:${}()|[]\/\\])/g, '\\$1')
    .replace(/x/g, '[\\dx]');

  return new RegExp(`${pattern}`, 'i');
}

function search(searchThrough: string, term: string) {
  const st = searchThrough.toLowerCase().replace(/_/g, ' ');
  return term.split(' ').every((t) => getSearchRegex(t).test(st));
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

    for (const term of terms) {
      if (search(course.id, term)) {
        courseIdResults.push(course);
      } else if (search(course.name, term)) {
        courseNameResults.push(course);
      }
    }
  };

  courseData.courses.forEach(checkCourse);

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

function fullId(course: ScheduleCourse) {
  return `${course.subject} ${course.number}`;
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

    const id = fullId(course);
    for (const term of terms) {
      if (search(id, term)) {
        courseIdResults.push(course);
      } else if (
        search(course.title, term) ||
        course.sections.some((s) => s.topic && search(s.topic, term))
      ) {
        courseNameResults.push(course);
      }
    }
  };

  courseData.forEach(checkCourse);

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

  courseIdResults.sort((a, b) => fullId(a).localeCompare(fullId(b)));
  courseNameResults.sort((a, b) => fullId(a).localeCompare(fullId(b)));

  return {
    results: courseIdResults.concat(courseNameResults),
    shortcut,
    limitExceeded: limitExceeded ? total - resultLimit : undefined,
  };
}
