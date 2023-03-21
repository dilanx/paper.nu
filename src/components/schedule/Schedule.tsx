import { motion } from 'framer-motion';
import React from 'react';
import { Alert } from '../../types/AlertTypes';
import { UserOptions } from '../../types/BaseTypes';
import {
  isSectionWithValidMeetingPattern,
  isValidScheduleSection,
  ScheduleData,
  ScheduleInteractions,
  ScheduleModificationFunctions,
  SectionWithValidMeetingPattern,
} from '../../types/ScheduleTypes';
import { SearchModificationFunctions } from '../../types/SearchTypes';
import { SideCard } from '../../types/SideCardTypes';
import Utility from '../../utility/Utility';
import Day from './Day';
import HoursColumn from './HoursColumn';

interface DayMeetingPatterns {
  [day: number]: SectionWithValidMeetingPattern[];
}

interface ScheduleProps {
  schedule: ScheduleData;
  alert: Alert;
  sideCard?: SideCard;
  interactions?: ScheduleInteractions;
  sf: ScheduleModificationFunctions;
  ff: SearchModificationFunctions;
  switches: UserOptions;
  imageMode?: boolean;
}

class Schedule extends React.Component<ScheduleProps> {
  render() {
    let days: JSX.Element[] = [];
    let sectionDays: DayMeetingPatterns = { 0: [], 1: [], 2: [], 3: [], 4: [] };

    let start = 9;
    let end = 18;

    const schedule = this.props.schedule.schedule;
    const imageMode = this.props.imageMode;

    for (let section_id in schedule) {
      let section = schedule[section_id];
      if (isValidScheduleSection(section)) {
        for (let i = 0; i < section.meeting_days.length; i++) {
          const swmp = {
            section,
            start_time: section.start_time[i],
            end_time: section.end_time[i],
            meeting_days: section.meeting_days[i],
            index: i,
          };
          if (!isSectionWithValidMeetingPattern(swmp)) {
            continue;
          }
          //if (!Utility.sectionMeetingPatternIsValid())
          const dayPattern = swmp.meeting_days;
          for (let j = 0; j < dayPattern.length; j++) {
            sectionDays[parseInt(dayPattern[j])].push(swmp);
          }

          // invariant: Paper data management system ensures
          // meeting_days, start_time, and end_time are all the same length
          start = Utility.fitHours(swmp.start_time, start, false);
          end = Utility.fitHours(swmp.end_time, end, true);
        }
      }
    }

    const previewSection = this.props.interactions?.previewSection.get;
    if (isValidScheduleSection(previewSection)) {
      previewSection.preview = true;
      for (let i = 0; i < previewSection.meeting_days.length; i++) {
        const swmp = {
          section: previewSection,
          start_time: previewSection.start_time[i],
          end_time: previewSection.end_time[i],
          meeting_days: previewSection.meeting_days[i],
          index: i,
        };
        if (!isSectionWithValidMeetingPattern(swmp)) {
          continue;
        }

        const dayPattern = swmp.meeting_days;
        for (let j = 0; j < dayPattern.length; j++) {
          sectionDays[parseInt(dayPattern[j])].push(swmp);
        }
        start = Utility.fitHours(swmp.start_time, start, false);
        end = Utility.fitHours(swmp.end_time, end, true);
      }
    }
    for (let i = 0; i < 5; i++) {
      let sections = [];

      for (let j = 0; j < sectionDays[i].length; j++) {
        const section = sectionDays[i][j];
        if (Utility.sectionMeetingPatternIsValid(section)) {
          sections.push(section);
        }
      }

      days.push(
        <Day
          index={i}
          start={start}
          end={end}
          sections={sections}
          bookmarks={this.props.schedule.bookmarks}
          alert={this.props.alert}
          sideCard={this.props.sideCard}
          interactions={this.props.interactions}
          sf={this.props.sf}
          ff={this.props.ff}
          switches={this.props.switches}
          imageMode={imageMode}
          key={`day-${i}`}
        />
      );
    }

    return (
      <motion.div
        className={`p-4 pt-2 ${
          imageMode ? 'absolute top-full h-imgh w-imgw' : 'relative flex-1'
        }`}
        id={imageMode ? 'schedule' : undefined}
        {...(!imageMode
          ? {
              initial: { x: 50, opacity: 0 },
              animate: { x: 0, opacity: 1 },
              exit: { x: 50, opacity: 0 },
              transition: { duration: 0.5 },
            }
          : {})}
      >
        <div
          className={`schedule-grid-cols grid rounded-lg border-4 border-green-200 border-opacity-75 bg-green-50 bg-opacity-50 p-4 shadow-md
                        dark:bg-gray-800 ${
                          imageMode ? 'h-full' : 'h-192 lg:h-full'
                        }`}
        >
          <HoursColumn start={start} end={end} />
          {days}
        </div>

        {imageMode && (
          <p className="absolute top-6 right-8 text-lg font-bold text-green-400 opacity-50 dark:text-green-200">
            PAPER.NU
          </p>
        )}
      </motion.div>
    );
  }
}

export default Schedule;
