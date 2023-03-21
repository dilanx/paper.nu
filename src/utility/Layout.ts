import {
  ScheduleHourMap,
  ScheduleLayoutMap,
  SectionWithValidMeetingPattern,
  Time,
} from '../types/ScheduleTypes';
import Utility from './Utility';

/*
    Adapted from salad.nu by Andy Xu
    https://github.com/Everthings/salad.nu/blob/master/src/utils/layoutUtils.js

    Redesigned to support multiple meeting patterns per section
*/

function overlaps(end1: Time, start2: Time) {
  return Utility.timeInMinutes(end1) > Utility.timeInMinutes(start2);
}

function getCollisionGroups(sections: SectionWithValidMeetingPattern[]) {
  const collisionGroups: SectionWithValidMeetingPattern[][] = [];
  let group: SectionWithValidMeetingPattern[] = [];
  for (const swmp of sections) {
    if (group.length !== 0) {
      let assigned = false;
      for (const member of group) {
        if (overlaps(member.end_time, swmp.start_time)) {
          assigned = true;
          break;
        }
      }

      if (!assigned) {
        collisionGroups.push(group);
        group = [swmp];
        continue;
      }
    }

    group.push(swmp);
  }

  if (group.length !== 0) collisionGroups.push(group);

  return collisionGroups;
}

function getCollisionColumns(
  collisionGroups: SectionWithValidMeetingPattern[][]
) {
  const collisionColumns: SectionWithValidMeetingPattern[][][] = [];
  for (const group of collisionGroups) {
    const columns: SectionWithValidMeetingPattern[][] = [];
    throughGroup: for (const swmp of group) {
      if (columns.length !== 0) {
        for (const column of columns) {
          const last = column[column.length - 1];
          if (!overlaps(last.end_time, swmp.start_time)) {
            column.push(swmp);
            continue throughGroup;
          }
        }
      }

      columns.push([swmp]);
    }

    collisionColumns.push(columns);
  }

  return collisionColumns;
}

export function getLayout(daySections?: SectionWithValidMeetingPattern[]) {
  const hourAssignments: ScheduleHourMap = {};
  const layoutMap: ScheduleLayoutMap = {};

  if (daySections) {
    const sections = daySections.sort((sa, sb) => {
      const { h: ha, m: ma } = sa.start_time;
      const { h: hb, m: mb } = sb.start_time;
      if (ha < hb) return -1;
      if (ha === hb && ma < mb) return -1;
      if (ha === hb && ma === mb) return 0;
      return 1;
    });
    const groups = getCollisionGroups(sections);
    const collisionColumns = getCollisionColumns(groups);

    for (const columns of collisionColumns) {
      const l = columns.length;
      for (let i = 0; i < columns.length; i++) {
        const column = columns[i];
        for (const swmp of column) {
          const h = swmp.start_time.h;
          if (h in hourAssignments) {
            hourAssignments[h].push(swmp);
          } else {
            hourAssignments[h] = [swmp];
          }

          if (!(swmp.section.section_id in layoutMap)) {
            layoutMap[swmp.section.section_id] = {};
          }

          layoutMap[swmp.section.section_id][swmp.index] = { i, l };
        }
      }
    }
  }

  return { hourAssignments, layoutMap };
}
