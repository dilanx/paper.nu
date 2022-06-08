import Account from './Account';
import JSONCourseData from './data/courses.json';
import { AccountPlansData } from './types/AccountTypes';
import { UserOptions } from './types/BaseTypes';
import {
    RawCourseData,
    PlanData,
    Course,
    SearchShortcut,
    SearchResults,
    SearchError,
} from './types/PlanTypes';

const courseData = JSONCourseData as RawCourseData;
const SEARCH_RESULT_LIMIT = 100;

function loadData(params: URLSearchParams): PlanData | 'malformed' | 'empty' {
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

                    let course = CourseManager.getCourse(courseId);
                    if (course == null) return 'malformed';
                    classData.push(course);
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

                        let course = CourseManager.getCourse(courseId);
                        if (course == null) return 'malformed';
                        if (i === 0) bookmarksNoCredit.add(course);
                        else bookmarksForCredit.add(course);
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

    for (let y = 0; y < courses.length; y++) {
        for (let q = 0; q < courses[y].length; q++) {
            let classes = courses[y][q]
                .map((course) => {
                    let sp = course.id.split(' ');
                    let subj = sp[0];
                    let num = sp[1];
                    let subjId = courseData.majors[subj].id;
                    return subjId + '_' + num;
                })
                .join(',');

            if (classes.length > 0) params.set(`y${y}q${q}`, classes);
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
            let subjId = courseData.majors[subj].id;
            return subjId + '_' + num;
        };

        params.set(
            'f',
            bookmarksNoCredit.map(conv).join(',') +
                ';' +
                bookmarksForCredit.map(conv).join(',')
        );
    }

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

let CourseManager = {
    data: courseData,

    search: (query: string): SearchResults | SearchError => {
        query = query.toLowerCase().replace(/-|_/g, ' ');
        let terms = [query];

        let firstWord = query.split(' ')[0];
        let shortcut: SearchShortcut | undefined;
        if (courseData.shortcuts[firstWord]) {
            let shortcuts = courseData.shortcuts[firstWord];
            let remainder = query.substring(firstWord.length + 1);
            terms = shortcuts.map(
                (shortcut) =>
                    shortcut.toLowerCase().replace(/-|_/g, ' ') +
                    ' ' +
                    remainder
            );
            shortcut = {
                replacing: firstWord.toUpperCase(),
                with: shortcuts.join(', '),
            };
        }

        for (let term of terms) {
            if (term.length < 3) {
                return 'too_short';
            }
        }

        let courseIdResults: Course[] = [];
        let courseNameResults: Course[] = [];

        courseData.courses.forEach((course) => {
            for (let term of terms) {
                if (
                    course.id.toLowerCase().replace(/-|_/g, ' ').includes(term)
                ) {
                    courseIdResults.push(course);
                } else if (
                    course.name
                        .toLowerCase()
                        .replace(/-|_/g, ' ')
                        .includes(term)
                ) {
                    courseNameResults.push(course);
                }
            }
        });

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
            limitExceeded: limitExceeded
                ? total - SEARCH_RESULT_LIMIT
                : undefined,
        };
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

        return null;
    },

    getCourse: (courseId: string) => {
        for (let course of courseData.courses) {
            if (course.id === courseId) {
                return course;
            }
        }
        return null;
    },

    getCourseColor: (courseId: string) => {
        let subj = courseId.split(' ')[0];
        return courseData.majors[subj].color;
    },

    load: async (params: URLSearchParams, switches: UserOptions) => {
        let activePlanId: string | undefined = undefined; // switches.get.active_plan_id as string | undefined;
        let accountPlans: AccountPlansData | undefined = undefined;
        if (Account.isLoggedIn()) {
            accountPlans = await Account.init();
            activePlanId = '0';
        }

        // Try to load from URL
        let data = CourseManager.loadFromURL(params);

        if (switches.get.save_to_storage) {
            // Try to load from account
            if (data === 'empty') {
                let storedPlanId = switches.get.active_plan_id as
                    | string
                    | undefined;
                if (accountPlans && storedPlanId) {
                    data = CourseManager.loadFromString(
                        accountPlans[storedPlanId]?.content
                    );
                    activePlanId = storedPlanId;
                }
            }

            // Try to load from storage
            if (data === 'empty') {
                data = CourseManager.loadFromStorage();
            }

            if (data !== 'malformed' && data !== 'empty') {
                CourseManager.save(data, false);
            }
        }

        switches.set('active_plan_id', activePlanId);
        return data;
    },

    loadFromURL: (params: URLSearchParams) => {
        return loadData(params);
    },

    loadFromStorage: () => {
        let dataStr = localStorage.getItem('data');
        if (!dataStr) return 'empty';
        let params = new URLSearchParams(dataStr);
        return loadData(params);
    },

    loadFromString: (dataStr?: string) => {
        if (!dataStr) return 'empty';
        return loadData(new URLSearchParams(dataStr));
    },

    getDataString: (data: PlanData) => {
        return saveData(data).toString();
    },

    save: (
        data: PlanData,
        saveToStorage: boolean,
        compareAgainstDataString?: string
    ) => {
        let params = saveData(data);
        let paramsStr = params.toString();

        window.history.replaceState(
            {},
            '',
            `${window.location.pathname}?${paramsStr}`
        );

        if (saveToStorage) {
            localStorage.setItem('data', paramsStr);
        }

        if (compareAgainstDataString) {
            return paramsStr === compareAgainstDataString;
        }

        return true;
    },
};

export default CourseManager;
