import { createEvents, DateArray, EventAttributes } from 'ics';
import ScheduleManager from '../ScheduleManager';
import {
  isSectionWithValidMeetingPattern,
  ScheduleData,
  ScheduleDataMap,
  SectionWithValidMeetingPattern,
  ValidScheduleDataMap,
  ValidScheduleSection,
} from '../types/ScheduleTypes';
import Utility from './Utility';

function getTimes(
  section: SectionWithValidMeetingPattern
): { start: DateArray; end: DateArray } | undefined {
  const date = Utility.getClosestMeetingDate(
    Utility.convertDate(section.section.start_date),
    section.meeting_days
  );
  if (!date) return;
  const { y, m, d } = date;
  const { h: hs, m: ms } = section.start_time;
  const { h: he, m: me } = section.end_time;
  return {
    start: [y, m + 1, d, hs, ms],
    end: [y, m + 1, d, he, me],
  };
}

function getRecurrenceRule(section: SectionWithValidMeetingPattern) {
  const { y, m, d } = Utility.convertDate(section.section.end_date);
  return `FREQ=WEEKLY;BYDAY=${Utility.convertAllDaysToArray(
    section.meeting_days
  ).join(',')};INTERVAL=1;UNTIL=${y}${(m + 1).toString().padStart(2, '0')}${d
    .toString()
    .padStart(2, '0')}T235959Z`;
}

export function getSections({ schedule }: ScheduleData) {
  let validSections: ValidScheduleDataMap = {};
  let invalidSections: ScheduleDataMap = {};

  for (const sectionId in schedule) {
    const section = schedule[sectionId];
    if (
      !section.preview &&
      section.start_date &&
      section.end_date &&
      section.start_time &&
      section.end_time &&
      section.meeting_days
    ) {
      validSections[sectionId] = section as ValidScheduleSection;
    } else {
      invalidSections[sectionId] = section;
    }
  }

  return { validSections, invalidSections };
}

export async function exportScheduleAsICS(validSections: ValidScheduleDataMap) {
  const events = [];
  for (const sectionId in validSections) {
    const section = validSections[sectionId];
    for (let pattern = 0; pattern < section.meeting_days.length; pattern++) {
      const swmp = {
        section,
        start_time: section.start_time[pattern],
        end_time: section.end_time[pattern],
        meeting_days: section.meeting_days[pattern],
        index: pattern,
      };

      if (!isSectionWithValidMeetingPattern(swmp)) {
        continue;
      }
      const times = getTimes(swmp);
      if (!times) throw new Error('Failed to get times for section');
      const { start, end } = times;

      const event: EventAttributes = {
        start,
        end,
        startOutputType: 'local',
        endOutputType: 'local',
        title: `${section.subject}${
          section.number ? ` ${section.number}` : ''
        }${
          section.component !== 'LEC'
            ? ` (${Utility.convertSectionComponent(section.component)})`
            : ''
        }`,
        description: section.title,
        location: section.room?.[pattern] || 'Unknown',
        geo: ScheduleManager.getLocation(section.room?.[pattern]),
        recurrenceRule: getRecurrenceRule(swmp),
      };
      events.push(event);
    }
  }

  const { error, value } = createEvents(events);
  if (error || !value) {
    throw error || new Error('Failed to create calendar events');
  }

  const blob = new Blob([value], { type: 'text/calendar' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = 'schedule.ics';
  link.href = url;
  link.click();
  window.URL.revokeObjectURL(url);
}
