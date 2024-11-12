import { useApp, useModification } from '@/app/Context';
import { openInfo } from '@/components/schedule/ScheduleSectionInfo';
import { Color } from '@/types/BaseTypes';
import { ScheduleInteractions, ScheduleSection } from '@/types/ScheduleTypes';
import {
  convertAllDaysToString,
  convertSectionComponent,
  convertTime,
} from '@/utility/Utility';
import { InformationCircleIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';

interface SearchScheduleSectionProps {
  section: ScheduleSection;
  color: Color;
  interactions: ScheduleInteractions;
  alreadyAdded: boolean;
}

const variants = {
  hidden: { y: -20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

function SearchScheduleSection({
  section,
  color,
  interactions,
  alreadyAdded,
}: SearchScheduleSectionProps) {
  const app = useApp();
  const { scheduleModification } = useModification();

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
          {meetingDays ? convertAllDaysToString(meetingDays) : 'no days'}
        </p>
        <p className="text-md font-normal">
          {startTime && endTime
            ? convertTime(startTime, true) + ' - ' + convertTime(endTime, true)
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
            scheduleModification.addSection(section);
          }
        }}
      >
        <p className="text-md overflow-hidden whitespace-nowrap px-2 font-bold">
          {section.section}
          <span className="pl-2 text-sm font-normal">
            {convertSectionComponent(section.component).toUpperCase()}
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
          className="absolute bottom-1 right-1 rounded-md p-0.5 hover:bg-black/5 active:bg-black/10 dark:hover:bg-white/5 dark:active:bg-white/10"
          onClick={(e) => {
            e.stopPropagation();
            openInfo({ section }, app, interactions);
          }}
        >
          <InformationCircleIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
        </button>
      </div>
    </motion.div>
  );
}

export default SearchScheduleSection;
