import debug from 'debug';
import localforage from 'localforage';
import { getPlanData } from './DataManager';
import {
  Course,
  PlanData,
  RawCourseData,
  SerializedPlanCourse,
  SerializedPlanData,
} from './types/PlanTypes';
import {
  FilterOptions,
  SearchError,
  SearchResults,
  SearchShortcut,
} from './types/SearchTypes';
import { DistroMap, Mode } from './utility/Constants';
import Utility from './utility/Utility';
const ds = debug('plan-manager:ser');

let courseData: RawCourseData | undefined = undefined;
const SEARCH_RESULT_LIMIT = 100;

async function loadCourseData() {
  if (!courseData) {
    courseData = await getPlanData();
  }
}

function basePlanArrays<T = Course>(data: any[][][] | undefined): T[][][] {
  if (!data) {
    return [
      [[], [], []],
      [[], [], []],
      [[], [], []],
    ];
  }

  while (data.length < 3) {
    data.push([[], [], []]);
  }

  for (let y = 0; y < data.length; y++) {
    while (data[y].length < 3) {
      data[y].push([]);
    }
  }

  return data;
}

async function loadData(
  serializedData: SerializedPlanData
): Promise<PlanData | 'malformed' | 'empty'> {
  await loadCourseData();

  if (!courseData) {
    return 'malformed';
  }

  let loadedSomething = false;
  let malformed = false;

  try {
    const data = basePlanArrays(
      serializedData.courses?.map((year, y) =>
        year.map((quarter, q) =>
          quarter
            .map<Course | null>((c) => {
              loadedSomething = true;
              if (typeof c === 'string') {
                const course = PlanManager.getCourse(c);
                if (course) {
                  ds('course loaded: %s (y%dq%d)', c, y, q);
                  return course;
                } else {
                  ds('course not found: %s (y%dq%d)', c, y, q);
                  malformed = true;
                  return null;
                }
              } else {
                ds('loaded custom course: %s (y%dq%d)', c.title, y, q);
                return {
                  id: c.title,
                  name: c.subtitle || '',
                  units: c.units || '',
                  repeatable: false,
                  description: '',
                };
              }
            })
            .sort((a, b) => (a?.id || '').localeCompare(b?.id || ''))
        )
      )
    );

    if (malformed) return 'malformed';

    const deserializeBookmarks = (
      type: 'for credit' | 'no credit',
      bookmarks?: string[]
    ) =>
      new Set(
        bookmarks?.map((c) => {
          loadedSomething = true;
          const course = PlanManager.getCourse(c);
          if (course) {
            ds('plan bookmark %s loaded: %s', type, c);
            return course;
          } else {
            ds('plan bookmark %s not found: %s', type, c);
            malformed = true;
            return null;
          }
        }) || []
      );

    const bookmarksNoCredit = deserializeBookmarks(
      'no credit',
      serializedData.bookmarks?.noCredit
    );
    const bookmarksForCredit = deserializeBookmarks(
      'for credit',
      serializedData.bookmarks?.forCredit
    );

    if (malformed) {
      return 'malformed';
    }

    if (!loadedSomething) {
      return 'empty';
    }

    return {
      courses: data,
      bookmarks: {
        noCredit: bookmarksNoCredit as Set<Course>,
        forCredit: bookmarksForCredit as Set<Course>,
      },
    };
  } catch (e) {
    return 'malformed';
  }
}

function saveData({ courses, bookmarks }: PlanData): SerializedPlanData {
  if (!courseData) {
    ds('course data is not loaded');
    return {};
  }

  const serializedData = courses.map((year) =>
    year.map((quarter) =>
      quarter.map<SerializedPlanCourse>((c) => {
        if (c.custom) {
          return {
            title: c.id,
            subtitle: c.name,
            units: c.units,
          };
        } else {
          return c.id;
        }
      })
    )
  );

  const serializedBookmarks = {
    noCredit: Array.from(bookmarks.noCredit).map((c) => c.id),
    forCredit: Array.from(bookmarks.forCredit).map((c) => c.id),
  };

  ds('course data saved');

  return {
    courses: serializedData,
    bookmarks: serializedBookmarks,
  };
}

function countCourseUnitsInHundreds(courseList: Course[] | Set<Course>) {
  let total = 0;
  courseList.forEach((course) => {
    total += parseFloat(course.units) * 100;
    if (total % 100 === 2) total -= 2;
    if (total % 50 === 1) total -= 1;
    if (total % 50 === 49) total += 1;
  });
  return total;
}

const PlanManager = {
  isPlanDataLoaded: () => !!courseData,
  loadPlanData: async () => await loadCourseData(),

  prepareQuery: (query: string) => {
    query = query.toLowerCase().replace(/-|_/g, ' ');
    let terms = [query];

    let firstWord = query.split(' ')[0];
    let shortcut: SearchShortcut | undefined;
    if (courseData?.shortcuts[firstWord]) {
      let shortcuts = courseData.shortcuts[firstWord];
      let remainder = query.substring(firstWord.length + 1);
      terms = shortcuts.map(
        (shortcut) =>
          shortcut.toLowerCase().replace(/-|_/g, ' ') + ' ' + remainder
      );
      shortcut = {
        replacing: firstWord.toUpperCase(),
        with: shortcuts.join(', '),
      };
    }

    // TODO remove this eventually lol
    if (query === 'elena') {
      terms = ['comp sci 446'];
    }

    return {
      terms,
      shortcut,
    };
  },

  search: (
    query: string,
    filter?: FilterOptions
  ): SearchResults<Course> | SearchError => {
    let { terms, shortcut } = PlanManager.prepareQuery(query);

    const filterExists =
      filter &&
      Object.keys(filter).filter(
        (f) =>
          f !== 'include' &&
          Utility.filterBelongsTo(f as keyof FilterOptions, Mode.PLAN)
      ).length > 0;

    if (!courseData) {
      if (query.length === 0) {
        return 'no_query';
      }

      return 'not_loaded';
    }

    if (!filterExists) {
      for (let term of terms) {
        if (term.length === 0) {
          return 'no_query';
        }

        if (term.length < 3) {
          return 'too_short';
        }
      }
    }

    let courseIdResults: Course[] = [];
    let courseNameResults: Course[] = [];

    const checkCourse = (course: Course) => {
      if (filterExists && !PlanManager.courseMatchesFilter(course, filter)) {
        return;
      }

      for (let term of terms) {
        if (course.id.toLowerCase().replace(/-|_/g, ' ').includes(term)) {
          courseIdResults.push(course);
        } else if (
          course.name.toLowerCase().replace(/-|_/g, ' ').includes(term)
        ) {
          courseNameResults.push(course);
        }
      }
    };

    courseData.courses.forEach(checkCourse);

    if (filter?.include?.includes('Legacy Courses')) {
      courseData.legacy.forEach(checkCourse);
    }

    let total = courseIdResults.length + courseNameResults.length;
    if (total === 0) return 'no_results';

    let limitExceeded = false;
    if (total > SEARCH_RESULT_LIMIT) {
      limitExceeded = true;
      if (courseIdResults.length > SEARCH_RESULT_LIMIT) {
        courseIdResults = courseIdResults.slice(0, SEARCH_RESULT_LIMIT);
        courseNameResults = [];
      } else {
        courseNameResults = courseNameResults.slice(
          0,
          SEARCH_RESULT_LIMIT - courseIdResults.length
        );
      }
    }

    courseIdResults.sort((a, b) => a.id.localeCompare(b.id));
    courseNameResults.sort((a, b) => a.name.localeCompare(b.name));

    let filtered = courseIdResults.concat(courseNameResults);

    return {
      results: filtered,
      shortcut: shortcut,
      limitExceeded: limitExceeded ? total - SEARCH_RESULT_LIMIT : undefined,
    };
  },

  courseMatchesFilter: (course: Course, filter?: FilterOptions): boolean => {
    if (!filter) return true;
    if (filter.subject && filter.subject !== course.id.split(' ')[0])
      return false;
    if (filter.distros) {
      if (
        !filter.distros.some((d) =>
          course.distros?.includes(DistroMap[d].toString())
        )
      ) {
        return false;
      }
    }

    const units = parseFloat(course.units);
    if (!isNaN(units)) {
      if (filter.unitGeq && units < filter.unitGeq) return false;
      if (filter.unitLeq && units > filter.unitLeq) return false;
    }

    return true;
  },

  getTotalCredits: ({ courses, bookmarks: { forCredit } }: PlanData) => {
    let total = 0;

    for (let y = 0; y < courses.length; y++) {
      for (let q = 0; q < courses[y].length; q++) {
        total += countCourseUnitsInHundreds(courses[y][q]);
        if (total % 100 === 2) total -= 2;
        if (total % 50 === 1) total -= 1;
        if (total % 50 === 49) total += 1;
      }
    }

    total += countCourseUnitsInHundreds(forCredit);
    if (total % 100 === 2) total -= 2;
    if (total % 50 === 1) total -= 1;
    if (total % 50 === 49) total += 1;

    return total / 100;
  },

  getQuarterCredits: (quarter: Course[] | Set<Course>) => {
    return countCourseUnitsInHundreds(quarter) / 100;
  },

  duplicateCourse: (course: Course, { courses }: PlanData) => {
    for (let y = 0; y < courses.length; y++) {
      for (let q = 0; q < courses[y].length; q++) {
        for (let c = 0; c < courses[y][q].length; c++) {
          if (courses[y][q][c].id === course.id) {
            return {
              year: y,
              quarter: q,
            };
          }
        }
      }
    }

    return undefined;
  },

  getCourse: (courseId: string) => {
    if (!courseData) return;
    for (let course of courseData.courses) {
      if (course.id === courseId) {
        return course;
      }
    }
    for (let course of courseData.legacy) {
      if (course.id === courseId) {
        course.legacy = true;
        return course;
      }
    }
  },

  getCourseColor: (courseId: string) => {
    if (!courseData) return 'gray';
    let subj = courseId.split(' ')[0];
    return courseData.majors[subj]?.color ?? 'gray';
  },

  isValidSubject: (subject: string) => {
    if (!courseData) return false;
    return !!courseData.majors[subject];
  },

  load: (serializedData: SerializedPlanData) => {
    return loadData(serializedData);
  },

  save: async (data: PlanData) => {
    const serializedData = saveData(data);
    await localforage.setItem('data_plan', serializedData);

    // TODO initiate save??
  },
};

export default PlanManager;
