import {
  SaveState,
  SubjectData,
  UniversityQuarter,
  UniversitySchools,
  UserOptions,
} from '@/types/BaseTypes';
import {
  Course,
  CourseTopic,
  PlanData,
  RawCourseData,
  SerializedPlanCourse,
  SerializedPlanData,
} from '@/types/PlanTypes';
import { FilterOptions } from '@/types/SearchTypes';
import { DisciplineMap, DistroMap } from '@/utility/Constants';
import { getAcadYear } from '@/utility/Utility';
import debug from 'debug';
import localforage from 'localforage';
import { v4 as uuidv4 } from 'uuid';
import { getPlanData, getSubjectData, getTermName } from './Data';
const ds = debug('plan-manager:ser');

let subjectData: SubjectData | undefined = undefined;
let schoolData: UniversitySchools | undefined = undefined;
let courseData: RawCourseData | undefined = undefined;

async function loadCourseData() {
  if (!subjectData || !schoolData || !courseData) {
    const subjectsAndSchools = await getSubjectData();
    subjectData = subjectsAndSchools.subjects;
    schoolData = subjectsAndSchools.schools;
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

export function initCourse(course: Course, topic?: string) {
  const courseData = JSON.parse(JSON.stringify(course)) as Course;
  courseData.iuid = uuidv4();
  courseData.itopic = topic;
  return courseData;
}

async function loadData(
  serializedData?: SerializedPlanData
): Promise<PlanData | 'malformed' | 'empty'> {
  await loadCourseData();

  if (!subjectData || !courseData) {
    return 'malformed';
  }

  let loadedSomething = false;

  try {
    const data = basePlanArrays(
      serializedData?.courses?.map((year, y) =>
        year.map((quarter, q) =>
          quarter
            .map<Course | null>((c) => {
              loadedSomething = true;
              if (typeof c === 'string') {
                const [courseId, topic] = c.split(';T=');
                const course = getCourse(courseId);
                if (course) {
                  ds('course loaded: %s (y%dq%d)', c, y, q);
                  return initCourse(
                    course,
                    topic ? decodeURIComponent(topic) : undefined
                  );
                } else {
                  ds('course not found: %s (y%dq%d)', c, y, q);
                  return null;
                }
              } else {
                ds('custom course loaded: %s (y%dq%d)', c.title, y, q);
                return {
                  id: c.title,
                  name: c.subtitle || '',
                  units: c.units || '',
                  repeatable: true,
                  description: 'Custom course',
                  color: c.color,
                  custom: true,
                };
              }
            })
            .filter((c) => c)
            .sort((a, b) => (a?.id || '').localeCompare(b?.id || ''))
        )
      )
    );

    const deserializeBookmarks = (
      type: 'for credit' | 'no credit',
      bookmarks?: string[]
    ) =>
      new Set(
        bookmarks
          ?.map((c) => {
            loadedSomething = true;
            const [courseId, topic] = c.split(';T=');
            const course = getCourse(courseId);
            if (course) {
              ds('plan bookmark %s loaded: %s', type, c);
              return initCourse(
                course,
                topic ? decodeURIComponent(topic) : undefined
              );
            } else {
              ds('plan bookmark %s not found: %s', type, c);
              return null;
            }
          })
          .filter((c) => c) || []
      );

    const bookmarksNoCredit = deserializeBookmarks(
      'no credit',
      serializedData?.bookmarks?.noCredit
    );
    const bookmarksForCredit = deserializeBookmarks(
      'for credit',
      serializedData?.bookmarks?.forCredit
    );

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

  const serializeId = (c: Course) =>
    c.id + (c.itopic ? `;T=${encodeURIComponent(c.itopic)}` : '');

  const serializedData = courses.map((year) =>
    year.map((quarter) =>
      quarter.map<SerializedPlanCourse>((c) => {
        if (c.custom) {
          return {
            title: c.id,
            subtitle: c.name,
            units: c.units,
            color: c.color,
          };
        } else {
          return serializeId(c);
        }
      })
    )
  );

  const serializedBookmarks = {
    noCredit: Array.from(bookmarks.noCredit).map(serializeId),
    forCredit: Array.from(bookmarks.forCredit).map(serializeId),
  };

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

export function isPlanDataLoaded() {
  return !!courseData;
}

export async function loadPlanData() {
  return await loadCourseData();
}

export function getPlanCourseData() {
  return courseData;
}

export function courseMatchesFilter(course: Course, filter?: FilterOptions) {
  if (!filter) return true;
  if (filter.subject && filter.subject !== course.id.split(' ')[0])
    return false;
  if (filter.distros) {
    if (
      !filter.distros.some(
        (d) => course.distros?.includes(DistroMap[d].toString())
      )
    ) {
      return false;
    }
  }
  if (filter.disciplines) {
    if (
      !filter.disciplines.some(
        (d) => course.disciplines?.includes(DisciplineMap[d].toString())
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
}

export function getTotalCredits({
  courses,
  bookmarks: { forCredit },
}: PlanData) {
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
}

export function getYearCredits(year: Course[][]) {
  let total = 0;
  for (let q = 0; q < year.length; q++) {
    total += countCourseUnitsInHundreds(year[q]);
  }
  return total / 100;
}

export function getQuarterCredits(quarter: Course[] | Set<Course>) {
  return countCourseUnitsInHundreds(quarter) / 100;
}

export function duplicateCourse(course: Course, { courses }: PlanData) {
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
}

export function getCourse(courseId: string) {
  if (!courseData) return;
  for (const course of courseData.courses) {
    if (course.id === courseId) {
      return course;
    }
  }
  for (const course of courseData.legacy) {
    if (course.id === courseId) {
      course.legacy = true;
      return course;
    }
  }
}

export function getCourseSubjectDisplayName(subject: string) {
  return subjectData?.[subject]?.display ?? subject;
}

export function getCourseColor(courseId: string) {
  if (!subjectData) return 'gray';
  const subj = courseId.split(' ')[0];
  return subjectData[subj]?.color ?? 'gray';
}

export function isValidSubject(subject: string) {
  if (!subjectData) return false;
  return !!subjectData[subject];
}

export function getAllSchoolSymbols() {
  return Object.keys(schoolData ?? {}).sort();
}

export function getSchoolName(symbol: string) {
  return schoolData?.[symbol]?.name ?? 'Unknown';
}

export function isSchoolSubject(symbol: string) {
  for (const s in schoolData ?? {}) {
    if (schoolData?.[s].subjects.some((subject) => subject.symbol === symbol)) {
      return true;
    }
  }
  return false;
}

export function getSchoolSubjects(symbol: string) {
  return schoolData?.[symbol]?.subjects ?? [];
}

export function getSchoolOfSubject(subject: string) {
  for (const s in schoolData ?? {}) {
    if (schoolData?.[s].subjects.some((s) => s.symbol === subject)) {
      return s;
    }
  }
}

export function getCourseTopics(course: Course) {
  const allCourseData = getPlanCourseData();
  if (!allCourseData) return null;
  const topics = allCourseData.topics[course.id];
  if (!topics) return null;
  if (topics.length === 0) return null;
  return topics;
}

export function getRecentTopics(course: Course) {
  const topics = getCourseTopics(course);
  if (!topics) return null;

  return topics
    .map<CourseTopic>(([term, topics]) => [
      term,
      topics.sort((a, b) => parseInt(b) - parseInt(a)),
    ])
    .sort((a, b) => parseInt(b[1][0]) - parseInt(a[1][0]));
}

export function getTopicsOrganized(course: Course) {
  const topics = getRecentTopics(course);
  const organized: { [quarter: string]: string[] } = {};

  for (const [topic, terms] of topics ?? []) {
    for (const term of terms) {
      if (!organized[term]) organized[term] = [];
      organized[term].push(topic);
    }
  }

  return organized;
}

export function getOfferings(course: Course, sortByOldest = false) {
  return (
    course.terms
      ?.sort((a, b) => (sortByOldest ? a.localeCompare(b) : b.localeCompare(a)))
      .map((term) => getTermName(term) || 'Unknown Term') ?? []
  );
}

export function getOfferingsOrganized(course: Course) {
  const offerings = getOfferings(course, true);
  const organized: { [acadYear: string]: string[] } = {};

  for (const offering of offerings) {
    const [year, quarter] = offering.split(' ');
    const acadYear = getAcadYear(parseInt(year), quarter as UniversityQuarter);
    if (!organized[acadYear]) organized[acadYear] = [];
    organized[acadYear].push(offering);
  }

  return organized;
}

export async function loadPlan(serializedData?: SerializedPlanData) {
  return await loadData(serializedData);
}

export async function loadPlanFromStorage() {
  const serializedData =
    await localforage.getItem<SerializedPlanData>('data_plan');
  return await loadData(serializedData || {});
}

export function serializePlan(data: PlanData) {
  const sData = saveData(data);
  ds('serialized plan data');
  return sData;
}

export function savePlan(data: PlanData, userOptions: UserOptions): SaveState {
  const serializedData = saveData(data);
  ds('serialized plan data and preparing to save');
  localforage
    .setItem('data_plan', serializedData)
    .then(() => {
      ds('plan data saved locally');
    })
    .catch(() => {
      ds('plan data failed to save locally');
    });

  const activeId = userOptions.get.active_plan_id;
  return !!activeId && activeId !== 'None' ? 'start' : 'idle';
}
