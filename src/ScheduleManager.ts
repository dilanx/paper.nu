import debug from 'debug';
import JSONSchoolData from './data/school.json';
import { getScheduleData } from './DataManager';
import PlanManager from './PlanManager';
import { UserOptions } from './types/BaseTypes';
import {
  RawSchoolData,
  ScheduleCourse,
  ScheduleData,
  ScheduleDataMap,
  ScheduleLocation,
  ScheduleSection,
  Time,
} from './types/ScheduleTypes';
import { FilterOptions, SearchError, SearchResults } from './types/SearchTypes';
import { Days, DistroMap, Mode } from './utility/Constants';
import Utility from './utility/Utility';
const ds = debug('schedule-manager:ser');

let scheduleData: ScheduleCourse[] | undefined = undefined;
const school = JSONSchoolData as RawSchoolData;
const SEARCH_RESULT_LIMIT = 50;

async function loadData(
  params: URLSearchParams
): Promise<ScheduleData | 'malformed' | 'empty'> {
  if (!PlanManager.isPlanDataLoaded()) {
    await PlanManager.loadPlanData();
  }
  let termId = params.get('t');
  let res = await getScheduleData(termId ?? undefined);

  if (res) {
    scheduleData = res.data;
  } else {
    if (termId) {
      res = await getScheduleData();
      scheduleData = res?.data;
    }
    return 'malformed';
  }

  if (!termId) {
    if (params.has('s') || params.has('sf')) {
      return 'malformed';
    }
    return 'empty';
  }

  let data: ScheduleData = {
    termId: termId,
    schedule: {},
    bookmarks: [],
  };

  try {
    if (params.has('s')) {
      let sections = params.get('s')!.split(',');

      let sectionData: ScheduleDataMap = {};
      for (let id of sections) {
        let section = ScheduleManager.getSectionById(id);
        if (!section) {
          ds('course section not found: %s', id);
          continue;
        }
        sectionData[id] = section;
        ds('course section loaded: %s', id);
      }
      data.schedule = sectionData;
    }
    if (params.has('sf')) {
      let bookmarks = params.get('sf')!.split(',');

      let bookmarksData: ScheduleCourse[] = [];
      for (let id of bookmarks) {
        let course = ScheduleManager.getCourseById(id);
        if (!course) {
          ds('course not found: %s', id);
          continue;
        }
        bookmarksData.push(course);
        ds('schedule bookmark added: %s', id);
      }
      data.bookmarks = bookmarksData;
    }
  } catch (e) {
    return 'malformed';
  }

  return data;
}

function saveData(data: ScheduleData) {
  let params = new URLSearchParams();
  let schedule = data.schedule;
  let bookmarks = data.bookmarks;

  params.set('t', data.termId ?? '');

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
  search: (
    query: string,
    filter?: FilterOptions
  ): SearchResults<ScheduleCourse> | SearchError => {
    // TODO this is repetitive between both search functions so it should be abstracted
    // TODO useTransition when searching
    let { terms, shortcut } = PlanManager.prepareQuery(query);
    const filterExists =
      filter &&
      Object.keys(filter).filter((f) =>
        Utility.filterBelongsTo(f as keyof FilterOptions, Mode.SCHEDULE)
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

    let data = scheduleData;

    let courseIdResults: ScheduleCourse[] = [];
    let courseNameResults: ScheduleCourse[] = [];

    data?.forEach((course) => {
      course.hide_section_ids = [];
      if (filterExists) {
        for (const section of course.sections) {
          if (!ScheduleManager.sectionMatchesFilter(section, filter)) {
            course.hide_section_ids.push(section.section_id);
          }
        }

        if (course.hide_section_ids.length === course.sections.length) return;
      }
      const id = course.subject + ' ' + course.number;
      for (let term of terms) {
        if (id.toLowerCase().replace(/-|_/g, ' ').includes(term)) {
          courseIdResults.push(course);
        } else if (
          course.title.toLowerCase().replace(/-|_/g, ' ').includes(term)
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

    courseIdResults.sort((a, b) =>
      (a.subject + ' ' + a.number).localeCompare(b.subject + ' ' + b.number)
    );
    courseNameResults.sort((a, b) => a.title.localeCompare(b.title));

    let filtered = courseIdResults.concat(courseNameResults);

    return {
      results: filtered,
      shortcut: shortcut,
      limitExceeded: limitExceeded ? total - SEARCH_RESULT_LIMIT : undefined,
    };
  },

  getCourseById: (id: string): ScheduleCourse | undefined => {
    if (!scheduleData) return;
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

  getLocation: (
    building_name?: string | null
  ): ScheduleLocation | undefined => {
    if (!building_name) return;
    return school.locations[building_name] ?? undefined;
  },

  getTechRoomFinderLink: (room: string) => {
    const names: { [key: string]: string } = {
      aud: 'L165',
      'lecture room 2': 'L171',
      'lecture room 3': 'L151',
      'lecture room 4': 'M113',
      'lecture room 5': 'M193',
    };

    let roomNumber: string | null = null;

    for (const name in names) {
      if (room.toLowerCase().includes(name)) {
        roomNumber = names[name];
      }
    }

    if (!roomNumber) {
      const sp = room.split(' ');
      roomNumber = sp[sp.length - 1];
    }

    if (!roomNumber || roomNumber.length !== 4) return null;

    let floor = roomNumber[1];
    if (floor === 'G') floor = '0';

    const link = `https://www.mccormick.northwestern.edu/contact/tech-room-finder-map.php?id=${roomNumber}&room-floor=${floor}`;

    return link;
  },

  getRoomFinderLink: (room: string) => {
    if (room.toLowerCase().includes('tech')) {
      return ScheduleManager.getTechRoomFinderLink(room);
    }

    return null;
  },

  getCourseColor: (subject: string) => {
    return PlanManager.getCourseColor(subject);
  },

  getAllSchoolSymbols: () => {
    return Object.keys(school.schools);
  },

  getSchoolName: (symbol: string) => {
    return school.schools[symbol]?.name ?? 'Unknown';
  },

  isSchoolSubject: (symbol: string) => {
    for (const s in school.schools) {
      if (
        school.schools[s].subjects.some((subject) => subject.symbol === symbol)
      ) {
        return true;
      }
    }
    return false;
  },

  getSchoolSubjects: (symbol: string) => {
    return school.schools[symbol]?.subjects ?? [];
  },

  getSchoolOfSubject: (subject: string) => {
    for (const s in school.schools) {
      if (school.schools[s].subjects.some((s) => s.symbol === subject)) {
        return s;
      }
    }
  },

  sectionMatchesFilter: (
    section: ScheduleSection,
    filter?: FilterOptions
  ): boolean => {
    if (!filter) return true;
    if (filter.subject && filter.subject !== section.subject) return false;

    const t = (
      start: (Time | null)[] | undefined,
      after: Time | undefined,
      before: Time | undefined
    ) => {
      const check = (against: Time | undefined) => {
        if (against) {
          if (!start) {
            return false;
          }

          for (let i = 0; i < start.length; i++) {
            const time = start[i];
            if (!time) {
              return false;
            }
            if (Utility.timeCompare(time, against) < 0) {
              return false;
            }
          }
        }

        return true;
      };

      return check(after) && check(before);
    };

    if (!t(section.start_time, filter.startAfter, filter.startBefore)) {
      return false;
    }
    if (!t(section.end_time, filter.endAfter, filter.endBefore)) {
      return false;
    }

    if (filter.meetingDays) {
      if (
        !section.meeting_days ||
        !Array.from(section.meeting_days).every(
          (d) => d && filter.meetingDays?.includes(Days[parseInt(d)])
        )
      ) {
        return false;
      }
    }

    if (filter.distros) {
      if (
        !filter.distros.some((d) =>
          section.distros?.includes(DistroMap[d].toString())
        )
      ) {
        return false;
      }
    }

    if (filter.components) {
      if (!filter.components.includes(section.component)) {
        return false;
      }
    }

    if (filter.instructor) {
      if (
        !section.instructors ||
        !section.instructors.some((instructor) =>
          instructor.name?.toLowerCase().includes(filter.instructor!)
        )
      ) {
        return false;
      }
    }

    if (filter.location) {
      if (
        !section.room ||
        !section.room.every((room) =>
          room?.toLowerCase().includes(filter.location!)
        )
      ) {
        return false;
      }
    }

    return true;
  },

  sectionsOverlap: (
    section: ScheduleSection,
    data: ScheduleDataMap
  ): ScheduleSection | undefined => {
    if (!section.meeting_days || !section.start_time || !section.end_time) {
      return;
    }

    for (let pattern = 0; pattern < section.meeting_days.length; pattern++) {
      const meetingDays = section.meeting_days[pattern];
      const startTime = section.start_time[pattern];
      const endTime = section.end_time[pattern];

      if (!meetingDays || !startTime || !endTime) {
        continue;
      }

      for (const other of Object.values(data)) {
        if (!other.meeting_days || !other.start_time || !other.end_time) {
          continue;
        }
        for (
          let sPattern = 0;
          sPattern < other.meeting_days.length;
          sPattern++
        ) {
          const otherMeetingDays = other.meeting_days[sPattern];
          const otherStartTime = other.start_time[sPattern];
          const otherEndTime = other.end_time[sPattern];

          if (!otherMeetingDays || !otherStartTime || !otherEndTime) {
            continue;
          }

          if (
            Array.from(meetingDays).some(
              (d) => otherMeetingDays.includes(d) ?? false
            )
          ) {
            if (
              Utility.timesOverlap(
                startTime,
                endTime,
                otherStartTime,
                otherEndTime
              )
            ) {
              return other;
            }
          }
        }
      }
    }
  },

  getTermFromDataString: (dataStr?: string) => {
    if (!dataStr) return;
    const params = new URLSearchParams(dataStr);
    return params.get('t') || undefined;
  },

  loadFromURL: async (params: URLSearchParams) => {
    return await loadData(params);
  },

  loadFromStorage: async () => {
    let dataStr = localStorage.getItem('schedule');
    if (!dataStr) return 'empty';
    let params = new URLSearchParams(dataStr);
    return await loadData(params);
  },

  loadFromString: async (dataStr?: string) => {
    if (!dataStr) return 'empty';
    return await loadData(new URLSearchParams(dataStr));
  },

  getDataString: (data: ScheduleData) => {
    return saveData(data).toString();
  },

  save: (
    data: ScheduleData,
    switches: UserOptions,
    compareAgainstDataString?: string
  ) => {
    let params = saveData(data);
    let paramsStr = params.toString();

    localStorage.setItem('schedule', paramsStr);

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
