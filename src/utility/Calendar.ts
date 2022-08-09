import { createEvents, DateArray, EventAttributes } from 'ics';
import ScheduleManager from '../ScheduleManager';
import {
  ScheduleData,
  ScheduleDataMap,
  ValidScheduleDataMap,
  ValidScheduleSection,
} from '../types/ScheduleTypes';
import Utility from './Utility';

function getTimes(
  section: ValidScheduleSection
): { start: DateArray; end: DateArray } | undefined {
  const date = Utility.getClosestMeetingDate(
    Utility.convertDate(section.start_date),
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

function getRecurrenceRule(section: ValidScheduleSection) {
  const { y, m, d } = Utility.convertDate(section.end_date);
  return `FREQ=WEEKLY;BYDAY=${Utility.convertAllDaysToArray(
    section.meeting_days
  ).join(',')};INTERVAL=1;UNTIL=${y}${m + 1}${d}T235959Z`;
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

export function exportScheduleAsICS(validSections: ValidScheduleDataMap) {
  const events = [];
  for (const sectionId in validSections) {
    const section = validSections[sectionId];
    const times = getTimes(section);
    if (!times) return false;
    const { start, end } = times;

    const event: EventAttributes = {
      start,
      end,
      title: `${section.subject} ${section.number}${
        section.component !== 'LEC'
          ? ` (${Utility.convertSectionComponent(section.component)})`
          : ''
      }`,
      description: section.title,
      location: section.room?.building_name,
      geo: ScheduleManager.getLocation(section.room?.building_name),
      recurrenceRule: getRecurrenceRule(section),
    };
    events.push(event);
  }

  const { error, value } = createEvents(events);
  if (error || !value) return false;

  const blob = new Blob([value], { type: 'text/calendar' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = 'schedule.ics';
  link.href = url;
  link.click();
  window.URL.revokeObjectURL(url);

  return true;
}
