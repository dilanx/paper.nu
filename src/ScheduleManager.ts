import debug from 'debug';
import localforage from 'localforage';
import { getScheduleData, getTermInfo } from './DataManager';
import PlanManager from './PlanManager';
import LocationsJson from './data/locations.json';
import SchoolsJson from './data/schools.json';
import {
  UniversityLocation,
  UniversityLocations,
  UniversitySchools,
  UserOptions,
} from './types/BaseTypes';
import {
  ScheduleCourse,
  ScheduleData,
  ScheduleDataMap,
  ScheduleSection,
  SerializedScheduleData,
  SerializedScheduleSection,
  Time,
} from './types/ScheduleTypes';
import { FilterOptions } from './types/SearchTypes';
import { Days, DistroMap } from './utility/Constants';
import Utility from './utility/Utility';
const ds = debug('schedule-manager:ser');

let scheduleData: ScheduleCourse[] | undefined = undefined;
const schools = SchoolsJson as UniversitySchools;
const locations = LocationsJson as UniversityLocations;

async function loadData(
  serializedData?: SerializedScheduleData
): Promise<ScheduleData | 'malformed' | 'empty'> {
  if (!PlanManager.isPlanDataLoaded()) {
    await PlanManager.loadPlanData();
  }

  const termId = serializedData?.termId;
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
    if (serializedData?.schedule || serializedData?.bookmarks) {
      return 'malformed';
    }
    return 'empty';
  }

  const data: ScheduleData = {
    termId: termId,
    schedule: {},
    bookmarks: [],
  };

  let customId = 1;

  try {
    for (const sSection of serializedData.schedule || []) {
      if (typeof sSection === 'string') {
        const section = ScheduleManager.getSectionById(sSection);
        if (!section) {
          ds('course section not found: %s', sSection);
          continue;
        }

        data.schedule[sSection] = section;
        ds('course section loaded: %s', sSection);
      } else {
        const sectionId = `CUSTOM-${customId}`;
        customId++;

        const { start, end } = getTermInfo(termId) || {};
        const section: ScheduleSection = {
          section_id: sectionId,
          title: sSection.subtitle || '',
          subject: sSection.title,
          section: '',
          meeting_days: [sSection.meeting_days],
          start_time: [sSection.start_time],
          end_time: [sSection.end_time],
          room: [null], // set location below
          component: 'CUS',
          start_date: start,
          end_date: end,
          color: sSection.color,
          custom: true,
        };

        if (sSection.instructor) {
          section.instructors = [
            {
              name: sSection.instructor,
            },
          ];
        }

        if (sSection.location) {
          section.room = [sSection.location.name];
          // TODO implement lat lon perhaps?
        }

        data.schedule[sectionId] = section;
        ds('custom course section loaded: %s as %s', sSection.title, sectionId);
      }
    }

    for (const sCourseId of serializedData.bookmarks || []) {
      const course = ScheduleManager.getCourseById(sCourseId);
      if (!course) {
        ds('bookmark course not found: %s', sCourseId);
        continue;
      }
      data.bookmarks.push(course);
      ds('schedule bookmark added: %s', sCourseId);
    }
    return data;
  } catch (e) {
    return 'malformed';
  }
}

function saveData({
  termId,
  schedule,
  bookmarks,
}: ScheduleData): SerializedScheduleData {
  const serializedData = Object.values(schedule).map<SerializedScheduleSection>(
    (s) => {
      if (s.custom) {
        return {
          title: s.subject,
          subtitle: s.title,
          meeting_days: s.meeting_days[0] as string,
          start_time: s.start_time[0] as Time,
          end_time: s.end_time[0] as Time,
          location: s.room[0]
            ? {
                name: s.room[0],
              }
            : undefined,
          instructor: s.instructors?.[0]?.name,
          color: s.color,
        };
      } else {
        return s.section_id;
      }
    }
  );

  const serializedBookmarks = bookmarks.map((s) => s.course_id);

  return {
    termId,
    schedule: serializedData,
    bookmarks: serializedBookmarks,
  };
}

const ScheduleManager = {
  getScheduleCourseData: () => scheduleData,

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
  ): UniversityLocation | undefined => {
    if (!building_name) return;
    return locations[building_name] ?? undefined;
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
    return Object.keys(schools);
  },

  getSchoolName: (symbol: string) => {
    return schools[symbol]?.name ?? 'Unknown';
  },

  isSchoolSubject: (symbol: string) => {
    for (const s in schools) {
      if (schools[s].subjects.some((subject) => subject.symbol === symbol)) {
        return true;
      }
    }
    return false;
  },

  getSchoolSubjects: (symbol: string) => {
    return schools[symbol]?.subjects ?? [];
  },

  getSchoolOfSubject: (subject: string) => {
    for (const s in schools) {
      if (schools[s].subjects.some((s) => s.symbol === subject)) {
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

  load: async (serializedData?: SerializedScheduleData) => {
    return await loadData(serializedData);
  },

  loadFromStorage: async () => {
    const serializedData = await localforage.getItem<SerializedScheduleData>(
      'data_schedule'
    );
    return await loadData(serializedData || {});
  },

  serialize: (data: ScheduleData) => {
    const sData = saveData(data);
    ds('serialized schedule data');
    return sData;
  },

  save: (data: ScheduleData, switches: UserOptions) => {
    const serializedData = saveData(data);
    ds('serialized schedule data and preparing to save');
    localforage
      .setItem('data_schedule', serializedData)
      .then(() => {
        ds('schedule data saved locally');
      })
      .catch(() => {
        ds('schedule data failed to save locally');
      });

    const activeId = switches.get.active_schedule_id;
    return !!activeId && activeId !== 'None';
  },
};

export default ScheduleManager;
