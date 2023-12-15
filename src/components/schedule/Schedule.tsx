import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { Alert } from '../../types/AlertTypes';
import {
  ContextMenu,
  ContextMenuData,
  UserOptions,
} from '../../types/BaseTypes';
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
import paperBlack from '../../assets/paper-full-black.png';
import paperWhite from '../../assets/paper-full-white.png';
import {
  ArrowTopRightOnSquareIcon,
  PlusIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import UtilityButton from '../menu/UtilityButton';
import Account from '../../Account';
import { exportScheduleAsImage } from '../../utility/Image';
import toast from 'react-hot-toast';
import exportMenu from '../menu/toolbar/Export';
import { exportScheduleAsICS } from '../../utility/Calendar';
import { OpenRatingsFn } from '../../types/RatingTypes';

interface DayMeetingPatterns {
  [day: number]: SectionWithValidMeetingPattern[];
}

interface ScheduleProps {
  schedule: ScheduleData;
  alert: Alert;
  sideCard?: SideCard;
  openRatings?: OpenRatingsFn;
  contextMenuData?: ContextMenuData;
  contextMenu?: ContextMenu;
  interactions?: ScheduleInteractions;
  sf: ScheduleModificationFunctions;
  ff: SearchModificationFunctions;
  switches: UserOptions;
  imageMode?: boolean;
}

export default function Schedule(props: ScheduleProps) {
  const [enableCustom, setEnableCustom] = useState(false);
  const [takeImage, setTakeImage] = useState(false);
  useEffect(() => {
    if (Account.isLoggedIn()) {
      const activeId = props.switches.get.active_schedule_id;
      if (activeId && activeId !== 'None') {
        setEnableCustom(true);
        return;
      }
    }
    setEnableCustom(false);
  }, [props.switches.get.active_schedule_id]);

  useEffect(() => {
    if (takeImage) {
      // delay by 1 second to allow logo to load
      const timeout = window.setTimeout(() => {
        exportScheduleAsImage(props.switches.get.dark).finally(() => {
          setTakeImage(false);
          toast.success('Exported schedule as image');
        });
      }, 1000);

      return () => {
        window.clearTimeout(timeout);
      };
    }
  }, [takeImage, props.switches]);

  let days: JSX.Element[] = [];
  let sectionDays: DayMeetingPatterns = { 0: [], 1: [], 2: [], 3: [], 4: [] };

  let start = 9;
  let end = 18;

  const schedule = props.schedule.schedule;
  const imageMode = props.imageMode;
  const dark = props.switches.get.dark;

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

  const previewSection = props.interactions?.previewSection.get;
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
        bookmarks={props.schedule.bookmarks}
        overrides={props.schedule.overrides}
        alert={props.alert}
        sideCard={props.sideCard}
        openRatings={props.openRatings}
        interactions={props.interactions}
        sf={props.sf}
        ff={props.ff}
        switches={props.switches}
        imageMode={imageMode}
        key={`day-${i}`}
      />
    );
  }

  return (
    <motion.div
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
        <HoursColumn start={start} end={end} />
        {days}
        {!imageMode && (
          <div className="absolute right-7 top-4 flex items-center gap-1">
            <UtilityButton
              Icon={PlusIcon}
              onClick={() => {
                if (enableCustom) {
                  props.sf.putCustomSection();
                } else {
                  props.alert({
                    title: 'Add custom sections to your schedule.',
                    message:
                      "Keep your entire school schedule, including things other than classes, in one place by adding custom sections to your schedule! You'll need to be logged in and have a schedule activated to do this.",
                    color: 'green',
                    icon: PlusIcon,
                    cancelButton: 'Close',
                    confirmButton: 'Go to schedules',
                    action: () => {
                      props.switches.set('tab', 'Plans');
                    },
                  });
                }
              }}
            >
              CUSTOM
            </UtilityButton>
            <UtilityButton
              Icon={ArrowTopRightOnSquareIcon}
              active={props.contextMenuData?.name === 'export'}
              onClick={(x, y) => {
                if (!props.contextMenu) {
                  return;
                }

                props.contextMenu(
                  exportMenu({
                    x,
                    y,
                    schedule: props.schedule,
                    alert: props.alert,
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
            <UtilityButton Icon={TrashIcon} onClick={() => props.sf.clear()}>
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
          <Schedule
            schedule={props.schedule}
            alert={props.alert}
            switches={props.switches}
            sf={undefined as any}
            ff={undefined as any}
            imageMode={true}
          />
        </div>
      )}
    </motion.div>
  );
}
