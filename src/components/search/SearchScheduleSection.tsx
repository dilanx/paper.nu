import { InformationCircleIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { Alert } from '../../types/AlertTypes';
import { Color } from '../../types/BaseTypes';
import {
  ScheduleInteractions,
  ScheduleModificationFunctions,
  ScheduleSection,
} from '../../types/ScheduleTypes';
import { SideCard } from '../../types/SideCardTypes';
import { openInfo } from '../schedule/ScheduleSectionInfo';
import Utility from '../../utility/Utility';
import { OpenRatingsFn } from '../../types/RatingTypes';

interface SearchScheduleSectionProps {
  section: ScheduleSection;
  color: Color;
  sf: ScheduleModificationFunctions;
  interactions: ScheduleInteractions;
  alreadyAdded: boolean;
  sideCard: SideCard;
  alert: Alert;
  openRatings: OpenRatingsFn;
}

const variants = {
  hidden: { y: -20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

function SearchScheduleSection({
  section,
  color,
  sf,
  interactions,
  alreadyAdded,
  sideCard,
  alert,
  openRatings,
}: SearchScheduleSectionProps) {
  let disabled =
    alreadyAdded ||
    !section.meeting_days?.length ||
    !section.start_time?.length ||
    !section.end_time?.length;

  let anyMeetingDays = false;
  let anyMeetingTimes = false;
  const meetingPatterns = [];

  for (let i = 0; i < section.meeting_days.length; i++) {
    const meetingDays = section.meeting_days[i];
    const startTime = section.start_time[i];
    const endTime = section.end_time[i];
    const room = section.room[i];

    if (meetingDays) anyMeetingDays = true;
    if (startTime && endTime) anyMeetingTimes = true;

    meetingPatterns.push(
      <div key={`sss-${section.section_id}-${i}`}>
        <p className="text-sm font-normal">
          {meetingDays
            ? Utility.convertAllDaysToString(meetingDays)
            : 'no days'}
        </p>
        <p className="text-md font-normal">
          {startTime && endTime
            ? Utility.convertTime(startTime, true) +
              ' - ' +
              Utility.convertTime(endTime, true)
            : 'no times'}
        </p>
        <p className="text-xs font-light">{room ?? 'no location'}</p>
      </div>
    );
  }

  if (!anyMeetingDays || !anyMeetingTimes) {
    disabled = true;
  }

  return (
    <motion.div variants={variants} className={`my-4 w-full`}>
      <div
        className={`relative block w-full rounded-lg border-2 border-transparent
                bg-gray-200 bg-opacity-50 text-left dark:bg-gray-700 dark:text-white ${
                  disabled
                    ? 'cursor-not-allowed opacity-60'
                    : `cursor-pointer hover:border-${color}-400`
                }`}
        onMouseEnter={() => {
          if (!disabled) interactions.previewSection.set(section);
        }}
        onMouseLeave={() => {
          if (!disabled) interactions.previewSection.clear();
        }}
        onClick={(e) => {
          e.stopPropagation();
          if (!disabled) {
            interactions.previewSection.clear();
            sf.addSection(section);
          }
        }}
      >
        <p className="text-md overflow-hidden whitespace-nowrap px-2 font-bold">
          {section.section}
          <span className="pl-2 text-sm font-normal">
            {Utility.convertSectionComponent(section.component).toUpperCase()}
          </span>
          {disabled && (
            <span className="pl-2 text-xs font-normal text-red-600 dark:text-red-400">
              {alreadyAdded ? 'already added' : 'no meeting times'}
            </span>
          )}
        </p>
        <hr className="mx-2 border border-gray-400 opacity-50" />
        <div className="flex flex-col gap-4 py-4 text-center">
          <p className="px-1 text-center text-sm font-medium">
            {section.topic}
          </p>
          {meetingPatterns}
          <p className="text-sm font-normal">
            {section.instructors?.map((i) => i.name).join(', ')}
          </p>
        </div>
        <button
          className="absolute bottom-1 right-1"
          onClick={(e) => {
            e.stopPropagation();
            openInfo(sideCard, alert, openRatings, section, interactions);
          }}
        >
          <InformationCircleIcon className="h-5 w-5 text-gray-600 opacity-60 hover:opacity-100 active:opacity-75 dark:text-gray-300" />
        </button>
      </div>
    </motion.div>
  );
}

export default SearchScheduleSection;
