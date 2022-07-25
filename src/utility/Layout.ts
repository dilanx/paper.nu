import {
    ScheduleHourMap,
    ScheduleLayoutMap,
    Time,
    ValidScheduleSection,
} from '../types/ScheduleTypes';
import Utility from './Utility';

/*
    Adapted from salad.nu by Andy Xu
    https://github.com/Everthings/salad.nu/blob/master/src/utils/layoutUtils.js
*/

function overlaps(end1: Time, start2: Time) {
    return Utility.timeInMinutes(end1) > Utility.timeInMinutes(start2);
}

function getCollisionGroups(sections: ValidScheduleSection[]) {
    const collisionGroups: ValidScheduleSection[][] = [];
    let group: ValidScheduleSection[] = [];
    for (const section of sections) {
        if (group.length !== 0) {
            let assigned = false;
            for (const member of group) {
                if (overlaps(member.end_time, section.start_time)) {
                    assigned = true;
                    break;
                }
            }

            if (!assigned) {
                collisionGroups.push(group);
                group = [section];
                continue;
            }
        }

        group.push(section);
    }

    if (group.length !== 0) collisionGroups.push(group);

    return collisionGroups;
}

function getCollisionColumns(collisionGroups: ValidScheduleSection[][]) {
    const collisionColumns: ValidScheduleSection[][][] = [];
    for (const group of collisionGroups) {
        const columns: ValidScheduleSection[][] = [];
        throughGroup: for (const section of group) {
            if (columns.length !== 0) {
                for (const column of columns) {
                    if (
                        !overlaps(
                            column[column.length - 1].end_time,
                            section.start_time
                        )
                    ) {
                        column.push(section);
                        continue throughGroup;
                    }
                }
            }

            columns.push([section]);
        }

        collisionColumns.push(columns);
    }

    return collisionColumns;
}

export function getLayout(daySections?: ValidScheduleSection[]) {
    const hourAssignments: ScheduleHourMap = {};
    const layoutMap: ScheduleLayoutMap = {};

    if (daySections) {
        const sections = daySections.sort(
            (
                { start_time: { h: ha, m: ma } },
                { start_time: { h: hb, m: mb } }
            ) => {
                if (ha < hb) return -1;
                if (ha === hb && ma < mb) return -1;
                if (ha === hb && ma === mb) return 0;
                return 1;
            }
        );
        const groups = getCollisionGroups(sections);
        const collisionColumns = getCollisionColumns(groups);

        for (const columns of collisionColumns) {
            const l = columns.length;
            for (let i = 0; i < columns.length; i++) {
                const column = columns[i];
                for (const section of column) {
                    const h = section.start_time.h;
                    if (h in hourAssignments) {
                        hourAssignments[h].push(section);
                    } else {
                        hourAssignments[h] = [section];
                    }

                    layoutMap[section.section_id] = { i, l };
                }
            }
        }
    }

    return { hourAssignments, layoutMap };
}
