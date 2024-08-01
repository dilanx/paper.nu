import { useApp, useData, useModification } from '@/app/Context';
import { isHiddenFromSchedule } from '@/app/Schedule';
import paperBlack from '@/assets/paper-full-black.png';
import paperWhite from '@/assets/paper-full-white.png';
import {
  ScheduleInteractions,
  SectionWithValidMeetingPattern,
  isSectionWithValidMeetingPattern,
  isValidScheduleSection,
} from '@/types/ScheduleTypes';
import { exportScheduleAsICS } from '@/utility/Calendar';
import { exportScheduleAsImage } from '@/utility/Image';
import { fitHours, sectionMeetingPatternIsValid } from '@/utility/Utility';
import {
  ArrowTopRightOnSquareIcon,
  PlusIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import UtilityButton from '../menu/UtilityButton';
import Day from './Day';
import exportMenu from './Export';
import HoursColumn from './HoursColumn';

interface DayMeetingPatterns {
  [day: number]: SectionWithValidMeetingPattern[];
}

interface ScheduleProps {
  interactions?: ScheduleInteractions;
  imageMode?: boolean;
}

export default function Schedule({ interactions, imageMode }: ScheduleProps) {
  const { userOptions, activeContextMenu, alert, contextMenu } = useApp();
  const { schedule } = useData();
  const { scheduleModification } = useModification();
  const [takeImage, setTakeImage] = useState(false);
  const [time, setTime] = useState<Date>(new Date());
  const ref = useRef<HTMLDivElement>(null);
  const timeBar = userOptions.get.time_bar;

  useEffect(() => {
    if (takeImage) {
      // delay by 1 second to allow logo to load
      const timeout = window.setTimeout(() => {
        exportScheduleAsImage(userOptions.get.dark).finally(() => {
          setTakeImage(false);
          toast.success('Exported schedule as image');
        });
      }, 1000);

      return () => {
        window.clearTimeout(timeout);
      };
    }
  }, [takeImage, userOptions.get.dark]);

  useEffect(() => {
    if (!timeBar) {
      return;
    }

    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [timeBar]);

  const days: JSX.Element[] = [];
  const sectionDays: DayMeetingPatterns = { 0: [], 1: [], 2: [], 3: [], 4: [] };

  let start = 9;
  let end = 18;

  const dark = userOptions.get.dark;

  for (const section_id in schedule.schedule) {
    const section = schedule.schedule[section_id];
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

        const dayPattern = swmp.meeting_days;
        let shouldFitHours = false;
        for (let j = 0; j < dayPattern.length; j++) {
          const day = parseInt(dayPattern[j]);
          if (
            isHiddenFromSchedule(
              schedule.overrides,
              swmp.section.section_id,
              day,
              swmp.start_time,
              swmp.end_time
            )
          ) {
            continue;
          }
          sectionDays[day].push(swmp);
          shouldFitHours = true;
        }

        // invariant: Paper data management system ensures
        // meeting_days, start_time, and end_time are all the same length
        if (shouldFitHours) {
          start = fitHours(swmp.start_time, start, false);
          end = fitHours(swmp.end_time, end, true);
        }
      }
    }
  }

  const previewSection = interactions?.previewSection.get;
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
      start = fitHours(swmp.start_time, start, false);
      end = fitHours(swmp.end_time, end, true);
    }
  }
  for (let i = 0; i < 5; i++) {
    const sections = [];

    for (let j = 0; j < sectionDays[i].length; j++) {
      const section = sectionDays[i][j];
      if (sectionMeetingPatternIsValid(section)) {
        sections.push(section);
      }
    }

    days.push(
      <Day
        index={i}
        start={start}
        end={end}
        sections={sections}
        interactions={interactions}
        time={
          timeBar
            ? {
                d: (time.getDay() - 1) % 7,
                h: time.getHours(),
                m: time.getMinutes(),
              }
            : undefined
        }
        imageMode={imageMode}
        key={`day-${i}`}
      />
    );
  }

  return (
    <motion.div
      ref={ref}
      className={`p-4 ${
        imageMode ? 'absolute top-full h-imgh w-imgw' : 'relative flex-1 pt-2'
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
        className={`schedule-grid-cols grid rounded-xl border-4 border-opacity-75 bg-white bg-opacity-50 p-4
                      shadow-md dark:bg-gray-800 ${
                        imageMode
                          ? 'h-full border-black dark:border-white'
                          : 'h-192 border-gray-300 dark:border-gray-700 lg:h-full'
                      }`}
      >
        <HoursColumn
          start={start}
          end={end}
          time={
            timeBar ? { h: time.getHours(), m: time.getMinutes() } : undefined
          }
          imageMode={imageMode}
        />
        {days}
        {!imageMode && (
          <div className="absolute right-7 top-4 flex items-center gap-1">
            <UtilityButton
              Icon={PlusIcon}
              onClick={() => {
                scheduleModification.putCustomSection();
              }}
            >
              CUSTOM
            </UtilityButton>
            <UtilityButton
              Icon={ArrowTopRightOnSquareIcon}
              active={activeContextMenu === 'export'}
              onClick={(x, y) => {
                contextMenu(
                  exportMenu({
                    x,
                    y,
                    schedule: schedule,
                    alert,
                    actions: {
                      image() {
                        setTakeImage(true);
                      },
                      calendar(validSections) {
                        toast.promise(exportScheduleAsICS(validSections), {
                          loading: 'Exporting schedule...',
                          success: 'Exported schedule',
                          error: (res) => {
                            console.error(res);
                            return 'Failed to export schedule';
                          },
                        });
                      },
                    },
                  })
                );
              }}
            >
              EXPORT
            </UtilityButton>
            <UtilityButton
              Icon={TrashIcon}
              onClick={() => scheduleModification.clear()}
            >
              CLEAR
            </UtilityButton>
          </div>
        )}
      </div>

      {imageMode && (
        <img
          src={dark ? paperWhite : paperBlack}
          alt="paper.nu"
          className="absolute right-8 top-6 h-[40px]"
        />
      )}

      {takeImage && (
        <div className="relative">
          <Schedule imageMode={true} />
        </div>
      )}
    </motion.div>
  );
}
