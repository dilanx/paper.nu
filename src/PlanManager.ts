import debug from 'debug';
import { getPlanData } from './DataManager';
import { UserOptions } from './types/BaseTypes';
import { Course, PlanData, RawCourseData } from './types/PlanTypes';
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

async function loadData(
  params: URLSearchParams
): Promise<PlanData | 'malformed' | 'empty'> {
  await loadCourseData();

  if (!courseData) {
    return 'malformed';
  }

  let allCourseData: Course[][][] = [
    [[], [], []],
    [[], [], []],
    [[], [], []],
    [[], [], []],
  ];

  let bookmarksNoCredit = new Set<Course>();
  let bookmarksForCredit = new Set<Course>();

  let loadedSomething = false;

  try {
    for (const [key, value] of params) {
      if (key.startsWith('y')) {
        loadedSomething = true;

        let year = parseInt(key.substring(1).split('q')[0]);
        let quarter = parseInt(key.split('q')[1]);
        let classes = value.split(',');
        let classData: Course[] = [];

        for (let id of classes) {
          let sp = id.split('_');
          let subjId = sp[0];
          let num = sp[1];
          let subj = courseData.major_ids[subjId];
          let courseId = subj + ' ' + num;

          let course = PlanManager.getCourse(courseId);
          if (!course) return 'malformed';
          classData.push(course);
          ds('course loaded: %s (y%dq%d)', courseId, year, quarter);
        }

        classData.sort((a, b) => {
          return a.id.localeCompare(b.id);
        });

        while (allCourseData.length < year + 1) {
          allCourseData.push([[], [], []]);
        }

        while (allCourseData[year].length < quarter + 1) {
          allCourseData[year].push([]);
        }

        allCourseData[year][quarter] = classData;
      }

      if (key.startsWith('f')) {
        loadedSomething = true;

        let classesLists = value.split(';');
        for (let i = 0; i < classesLists.length; i++) {
          let classes = classesLists[i].split(',');
          for (let id of classes) {
            if (id === '') continue;
            let sp = id.split('_');
            let subjId = sp[0];
            let num = sp[1];
            let subj = courseData.major_ids[subjId];
            let courseId = subj + ' ' + num;

            let course = PlanManager.getCourse(courseId);
            if (!course) return 'malformed';
            if (i === 0) {
              bookmarksNoCredit.add(course);
              ds('plan bookmark added: %s (credit = false)', courseId);
            } else {
              bookmarksForCredit.add(course);
              ds('plan bookmark added: %s (credit = true)', courseId);
            }
          }
        }
      }
    }
  } catch (e) {
    return 'malformed';
  }

  if (!loadedSomething) return 'empty';

  return {
    courses: allCourseData,
    bookmarks: {
      noCredit: bookmarksNoCredit,
      forCredit: bookmarksForCredit,
    },
  };
}

function saveData({ courses, bookmarks }: PlanData) {
  let params = new URLSearchParams();

  if (!courseData) {
    ds('course data is not loaded');
    return params;
  }

  for (let y = 0; y < courses.length; y++) {
    for (let q = 0; q < courses[y].length; q++) {
      let str = '';
      for (let course of courses[y][q]) {
        let sp = course.id.split(' ');
        let subj = sp[0];
        let num = sp[1];
        let subjId = courseData?.majors[subj].id;
        str += `${subjId}_${num},`;
      }
      if (str.length > 0) {
        params.set(`y${y}q${q}`, str.substring(0, str.length - 1));
      }
    }
  }

  let bookmarksNoCredit = Array.from(bookmarks.noCredit);
  let bookmarksForCredit = Array.from(bookmarks.forCredit);

  if (bookmarksNoCredit.length > 0 || bookmarksForCredit.length > 0) {
    let conv = (course: Course) => {
      let courseId = course.id;
      let sp = courseId.split(' ');
      let subj = sp[0];
      let num = sp[1];
      let subjId = courseData?.majors[subj].id;
      return subjId + '_' + num;
    };

    params.set(
      'f',
      bookmarksNoCredit.map(conv).join(',') +
        ';' +
        bookmarksForCredit.map(conv).join(',')
    );
  }

  ds('course data saved');

  return params;
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

    if (!courseData) {
      return 'not_loaded';
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

  loadFromURL: async (params: URLSearchParams) => {
    return await loadData(params);
  },

  loadFromStorage: async () => {
    let dataStr = localStorage.getItem('data');
    if (!dataStr) return 'empty';
    let params = new URLSearchParams(dataStr);
    return await loadData(params);
  },

  loadFromString: async (dataStr?: string) => {
    if (!dataStr) return 'empty';
    return await loadData(new URLSearchParams(dataStr));
  },

  getDataString: (data: PlanData) => {
    return saveData(data).toString();
  },

  save: (
    data: PlanData,
    switches: UserOptions,
    compareAgainstDataString?: string
  ) => {
    let params = saveData(data);
    let paramsStr = params.toString();

    localStorage.setItem('data', paramsStr);

    let activePlanId = switches?.get.active_plan_id as string | undefined;

    if (activePlanId && activePlanId !== 'None') {
      return paramsStr !== compareAgainstDataString;
    }

    return false;
  },
};

export default PlanManager;
