import React from 'react';
import {
    ScheduleData,
    ScheduleInteractions,
    ScheduleModificationFunctions,
    ScheduleSection,
} from '../../types/ScheduleTypes';
import Utility from '../../utility/Utility';
import Day from './Day';
import HoursColumn from './HoursColumn';

interface ScheduleProps {
    schedule: ScheduleData;
    interactions: ScheduleInteractions;
    sf: ScheduleModificationFunctions;
}

class Schedule extends React.Component<ScheduleProps> {
    render() {
        let days: JSX.Element[] = [];
        let sectionDays: {
            [day: number]: ScheduleSection[];
        } = { 0: [], 1: [], 2: [], 3: [], 4: [] };

        let start = 9;
        let end = 18;

        const schedule = this.props.schedule.schedule;

        for (let section_id in schedule) {
            let section = schedule[section_id];
            if (section.meeting_days) {
                for (let i = 0; i < section.meeting_days.length; i++) {
                    sectionDays[parseInt(section.meeting_days[i])].push(
                        section
                    );
                }

                start = Utility.fitHours(section.start_time, start, false);
                end = Utility.fitHours(section.end_time, end, true);
            }
        }

        const previewSection = this.props.interactions.previewSection.get;
        if (previewSection?.meeting_days) {
            previewSection.preview = true;
            for (let i = 0; i < previewSection.meeting_days.length; i++) {
                sectionDays[parseInt(previewSection.meeting_days[i])].push(
                    previewSection
                );
            }
            start = Utility.fitHours(previewSection.start_time, start, false);
            end = Utility.fitHours(previewSection.end_time, end, true);
        }
        for (let i = 0; i < 5; i++) {
            let sections = sectionDays[i];

            days.push(
                <Day
                    index={i}
                    start={start}
                    end={end}
                    sections={sections}
                    interactions={this.props.interactions}
                    sf={this.props.sf}
                    key={`day-${i}`}
                />
            );
        }

        return (
            <div className="h-full relative p-4">
                <div
                    className="p-4 border-4 border-green-200 bg-green-50 dark:bg-gray-800 bg-opacity-50 border-opacity-75 h-192 lg:h-full rounded-lg shadow-md grid
                        grid-cols-[3.2rem_repeat(5,_minmax(0,_1fr))]"
                >
                    <HoursColumn start={start} end={end} />
                    {days}
                </div>
            </div>
        );
    }
}

export default Schedule;
