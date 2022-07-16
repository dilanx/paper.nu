import debug from 'debug';
import JSONCourseData from './data/schedule_data.json';
import PlanManager from './PlanManager';
import { SearchError, SearchResults, UserOptions } from './types/BaseTypes';
import {
    ScheduleCourse,
    ScheduleData,
    ScheduleDataMap,
    ScheduleSection,
} from './types/ScheduleTypes';
var ds = debug('schedule-manager:ser');
var dp = debug('schedule-manager:op');

const scheduleData = JSONCourseData as ScheduleCourse[];
const SEARCH_RESULT_LIMIT = 50;

function loadData(
    params: URLSearchParams
): ScheduleData | 'malformed' | 'empty' {
    let data: ScheduleData = {
        schedule: {},
        bookmarks: [],
    };

    let loadedSomething = false;

    try {
        if (params.has('s')) {
            loadedSomething = true;
            let sections = params.get('s')!.split(',');

            let sectionData: ScheduleDataMap = {};
            for (let id of sections) {
                let section = ScheduleManager.getSectionById(id);
                if (!section) return 'malformed';
                sectionData[id] = section;
                ds('course section loaded: %s', id);
            }
            data.schedule = sectionData;
        }
        if (params.has('sf')) {
            loadedSomething = true;
            let bookmarks = params.get('sf')!.split(',');

            let bookmarksData: ScheduleCourse[] = [];
            for (let id of bookmarks) {
                let course = ScheduleManager.getCourseById(id);
                if (!course) return 'malformed';
                bookmarksData.push(course);
                ds('schedule bookmark added: %s', id);
            }
            data.bookmarks = bookmarksData;
        }
    } catch (e) {
        return 'malformed';
    }

    if (!loadedSomething) return 'empty';

    return data;
}

function saveData(data: ScheduleData) {
    let params = new URLSearchParams();
    let schedule = data.schedule;
    let bookmarks = data.bookmarks;

    let s = [];
    for (let id in schedule) {
        s.push(id);
    }
    if (s.length > 0) params.set('s', s.join(','));

    let b = [];
    for (let course of bookmarks) {
        b.push(course.course_id);
    }
    if (b.length > 0) params.set('sf', b.join(','));

    ds('schedule data saved');

    return params;
}

const ScheduleManager = {
    data: scheduleData,

    search: (query: string): SearchResults<ScheduleCourse> | SearchError => {
        let { terms, shortcut } = PlanManager.prepareQuery(query);

        for (let term of terms) {
            if (term.length < 3) {
                return 'too_short';
            }
        }

        let courseIdResults: ScheduleCourse[] = [];
        let courseNameResults: ScheduleCourse[] = [];

        scheduleData.forEach((course) => {
            const id = course.subject + ' ' + course.number;
            for (let term of terms) {
                if (id.toLowerCase().replace(/-|_/g, ' ').includes(term)) {
                    courseIdResults.push(course);
                } else if (
                    course.title
                        .toLowerCase()
                        .replace(/-|_/g, ' ')
                        .includes(term)
                ) {
                    courseNameResults.push(course);
                }
            }
        });

        let total = courseIdResults.length + courseNameResults.length;
        dp('search: %s (%d results)', query, total);
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

        courseIdResults.sort((a, b) =>
            (a.subject + ' ' + a.number).localeCompare(
                b.subject + ' ' + b.number
            )
        );
        courseNameResults.sort((a, b) => a.title.localeCompare(b.title));

        let filtered = courseIdResults.concat(courseNameResults);

        return {
            results: filtered,
            shortcut: shortcut,
            limitExceeded: limitExceeded
                ? total - SEARCH_RESULT_LIMIT
                : undefined,
        };
    },

    getCourseById: (id: string): ScheduleCourse | undefined => {
        for (let course of scheduleData) {
            if (course.course_id === id) {
                return course;
            }
        }
    },

    getSectionById: (id: string): ScheduleSection | undefined => {
        let courseId = id.split('-')[0];
        let course = ScheduleManager.getCourseById(courseId);
        return course?.sections.find((section) => section.section_id === id);
    },

    getCourseColor: (subject: string) => {
        return PlanManager.data.majors[subject]?.color ?? 'gray';
    },

    loadFromURL: (params: URLSearchParams) => {
        return loadData(params);
    },

    loadFromStorage: () => {
        let dataStr = localStorage.getItem('schedule');
        if (!dataStr) return 'empty';
        let params = new URLSearchParams(dataStr);
        return loadData(params);
    },

    loadFromString: (dataStr?: string) => {
        if (!dataStr) return 'empty';
        return loadData(new URLSearchParams(dataStr));
    },

    save: (
        data: ScheduleData,
        switches?: UserOptions,
        compareAgainstDataString?: string
    ) => {
        let params = saveData(data);
        let paramsStr = params.toString();

        window.history.replaceState(
            {},
            '',
            `${window.location.pathname}?${paramsStr}`
        );

        if (switches?.get.save_to_storage) {
            localStorage.setItem('schedule', paramsStr);
        }

        let activeScheduleId = switches?.get.active_schedule_id as
            | string
            | undefined;

        if (activeScheduleId && activeScheduleId !== 'None') {
            return paramsStr !== compareAgainstDataString;
        }

        return false;
    },
};

export default ScheduleManager;
