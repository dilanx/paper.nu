import debug from 'debug';
import JSONCourseData from './data/schedule_data.json';
import PlanManager from './PlanManager';
import {
    LoadMethods,
    SearchError,
    SearchResults,
    UserOptions,
} from './types/BaseTypes';
import {
    ScheduleCourse,
    ScheduleData,
    ScheduleSection,
} from './types/ScheduleTypes';
var ds = debug('schedule-manager:ser');
var dp = debug('schedule-manager:op');

const scheduleData = JSONCourseData as ScheduleCourse[];
const SEARCH_RESULT_LIMIT = 50;

function loadData(
    params: URLSearchParams
): ScheduleData | 'malformed' | 'empty' {
    let data: ScheduleData = {};

    let loadedSomething = false;

    try {
        if (params.has('s')) {
            loadedSomething = true;
            let sections = params.get('s')!.split(',');

            for (let id of sections) {
                let section = ScheduleManager.getSectionById(id);
                if (!section) return 'malformed';
                data[id] = section;
                ds('course section loaded: %s', id);
            }
        }
    } catch (e) {
        return 'malformed';
    }

    if (!loadedSomething) return 'empty';

    return data;
}

function saveData(data: ScheduleData) {
    let params = new URLSearchParams();

    let s = [];
    for (let id in data) {
        s.push(id);
    }
    if (s.length > 0) params.set('s', s.join(','));

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

    getSectionById: (id: string): ScheduleSection | undefined => {
        let courseId = id.split('-')[0];
        for (let course of scheduleData) {
            if (course.course_id === courseId) {
                return course.sections.find(
                    (section) => section.section_id === id
                );
            }
        }
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

    save: (data: ScheduleData, switches?: UserOptions) => {
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

        // TODO compare against active plan

        return false;
    },
};

export default ScheduleManager;
