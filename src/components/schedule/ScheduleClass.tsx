import {
  AcademicCapIcon,
  BuildingLibraryIcon,
  CalendarDaysIcon,
  ClockIcon,
  DocumentCheckIcon,
  HashtagIcon,
  InformationCircleIcon,
  ListBulletIcon,
  MapPinIcon,
  PuzzlePieceIcon,
  TrashIcon,
  UserIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';
import { ReactNode } from 'react';
import PlanManager from '../../PlanManager';
import ScheduleManager from '../../ScheduleManager';
import { Alert } from '../../types/AlertTypes';
import { IconElement, UserOptions } from '../../types/BaseTypes';
import { Course } from '../../types/PlanTypes';
import {
  ScheduleBookmarks,
  ScheduleInteractions,
  ScheduleModificationFunctions,
  ScheduleSection,
} from '../../types/ScheduleTypes';
import { SearchModificationFunctions } from '../../types/SearchTypes';
import {
  AnySideCardButtonData,
  SideCard,
  SideCardData,
  SideCardItemData,
} from '../../types/SideCardTypes';
import Utility from '../../utility/Utility';

interface ScheduleClassProps {
  section: ScheduleSection;
  bookmarks: ScheduleBookmarks;
  alert?: Alert;
  sideCard?: SideCard;
  interactions?: ScheduleInteractions;
  sf: ScheduleModificationFunctions;
  ff: SearchModificationFunctions;
  switches: UserOptions;
  imageMode?: boolean;
  split?: { i: number; l: number };
}

function getDetails(
  detail: string,
  section: ScheduleSection,
  course?: Course,
  alert?: Alert
): [IconElement, ReactNode] | undefined {
  switch (detail) {
    case 'SECTION NUMBER':
      return [HashtagIcon, section.section];
    case 'COMPONENT':
      return [
        PuzzlePieceIcon,
        Utility.capitalizeFirstLetter(
          Utility.convertSectionComponent(section.component)
        ),
      ];
    case 'TIME SLOT':
      return [
        ClockIcon,
        `${
          section.meeting_days && section.start_time && section.end_time
            ? `${Utility.convertAllDaysToString(
                section.meeting_days
              )} ${Utility.convertTime(
                section.start_time,
                true
              )} - ${Utility.convertTime(section.end_time, true)}`
            : undefined
        }`,
      ];
    case 'INSTRUCTOR':
      return [
        UserIcon,
        section.instructors?.map((instructor, i) => (
          <button
            className="my-1 underline underline-offset-4
              hover:text-rose-500 dark:hover:text-rose-300
              active:text-rose-600 dark:active:text-rose-200"
            key={`section-info-instructor-${i}`}
            onClick={() => {
              alert?.({
                icon: UserIcon,
                title: instructor.name ?? 'No name',
                subtitle: `${section.subject} ${section.number} (section ${section.section})`,
                color: 'rose',
                cancelButton: 'Close',
                extras: [
                  {
                    title: 'Phone Number',
                    content: instructor.phone ?? 'Not provided',
                  },
                  {
                    title: 'Campus Address',
                    content: instructor.campus_address ?? 'Not provided',
                  },
                  {
                    title: 'Office Hours',
                    content: instructor.office_hours ?? 'Not provided',
                  },
                  {
                    title: 'Bio',
                    content: instructor.bio ?? 'Not provided',
                  },
                  {
                    title: 'URL',
                    content: instructor.url ?? 'Not provided',
                  },
                ],
              });
            }}
          >
            {instructor.name}
          </button>
        )),
      ];
    case 'LOCATION':
      return [MapPinIcon, section.room];
    case 'START/END DATES':
      return [
        CalendarDaysIcon,
        section.start_date && section.end_date
          ? `${section.start_date} to ${section.end_date}`
          : undefined,
      ];
    case 'PREREQUISITES':
      return [ListBulletIcon, course?.prereqs];
    case 'DISTRIBUTION AREAS':
      return [
        BuildingLibraryIcon,
        section?.distros
          ? Utility.convertDistros(section.distros).join(', ')
          : undefined,
      ];
    case 'UNITS':
      return [AcademicCapIcon, course?.units];
    case 'CAPACITY':
      return [UsersIcon, section.capacity];
    case 'ENROLLMENT REQUIREMENTS':
      return [
        DocumentCheckIcon,
        Utility.cleanEnrollmentRequirements(section.enrl_req),
      ];
    case 'DESCRIPTIONS':
      return [
        InformationCircleIcon,
        section?.descs ? (
          <div className="flex flex-col gap-2">
            {section.descs.map(([name, value], i) => (
              <div key={`section-info-desc-${i}`}>
                <p>{name}</p>
                <p className="text-left font-light text-sm">{value}</p>
              </div>
            ))}
          </div>
        ) : undefined,
      ];
  }
}

function openInfo(props: ScheduleClassProps) {
  if (!props.sideCard) return;
  const section = props.section;
  const name = section.subject + ' ' + section.number;
  const course = PlanManager.getCourse(name);
  const scheduleCourse = ScheduleManager.getCourseById(
    section.section_id.split('-')[0]
  );

  const items = props.switches.get.section_info_details?.split(',') ?? [
    'SECTION NUMBER',
    'COMPONENT',
    'TIME SLOT',
    'INSTRUCTOR',
    'LOCATION',
    'START/END DATES',
    'PREREQUISITES',
    'DISTRIBUTION AREAS',
    'UNITS',
    'CAPACITY',
    'ENROLLMENT REQUIREMENTS',
    'DESCRIPTIONS',
  ];

  const sideCardButtons: AnySideCardButtonData[] = [
    {
      text: 'Show all sections',
      onClick: () => props.ff.set(name, scheduleCourse?.course_id),
    },
    {
      text: 'Remove section',
      danger: true,
      onClick: (close) => {
        props.sf.removeSection(section);
        close();
      },
    },
  ];

  if (scheduleCourse) {
    sideCardButtons.splice(1, 0, {
      toggle: true,
      data: props.bookmarks,
      key: scheduleCourse,
      indexProperty: 'course_id',
      enabled: {
        text: 'Remove from My List',
        onClick: () => {
          props.sf.removeScheduleBookmark(scheduleCourse);
        },
      },
      disabled: {
        text: 'Add to My List',
        onClick: () => {
          props.sf.addScheduleBookmark(scheduleCourse);
        },
      },
    });
  }

  const sideCardData: SideCardData = {
    type: 'SECTION INFO',
    themeColor: PlanManager.getCourseColor(name),
    title: name,
    subtitle: section.title,
    message: course?.description ?? 'No course description available',
    items: items.reduce<SideCardItemData[]>((filtered, item) => {
      const [icon, value] =
        getDetails(item, section, course, props.alert) ?? [];
      if (value) {
        filtered.push({
          key: item,
          icon,
          value,
        });
      }
      return filtered;
    }, []),
    buttons: sideCardButtons,
  };

  props.sideCard(sideCardData);
}

function ScheduleClass(props: ScheduleClassProps) {
  const { section, interactions, sf, switches, imageMode, split } = props;
  const { start_time, end_time, subject, number, title, instructors } = section;
  const color = ScheduleManager.getCourseColor(subject);

  const startDif = start_time!.m / 60;
  const length =
    end_time!.h * 60 + end_time!.m - (start_time!.h * 60 + start_time!.m);
  const endDif = length / 60;

  const instructorLastNames = instructors
    ?.map((i) => i.name?.split(' ').pop())
    .join(', ');

  let left = '0%';
  let width = '100%';
  if (split) {
    const { i, l } = split;
    left = `${(i / l) * 100}%`;
    width = `${100 / l}%`;
  }

  return (
    <div
      className={`absolute z-10 rounded-lg bg-opacity-60
                bg-${color}-100 dark:bg-gray-800 border-2 border-l-4 border-${color}-400 overflow-visible
                cursor-pointer transition ease-in-out duration-300 group ${
                  interactions?.hoverSection.get === section.section_id
                    ? '-translate-y-2 shadow-lg'
                    : ''
                } ${section.preview ? 'opacity-60' : ''}`}
      style={{
        top: `${startDif * 100}%`,
        left,
        width,
        height: `calc(${endDif * 100}% + ${
          2 * (end_time!.h - start_time!.h)
        }px)`,
      }}
      onMouseEnter={() => {
        interactions?.hoverSection.set(section.section_id);
      }}
      onMouseLeave={() => {
        interactions?.multiClear(['hoverSection', 'hoverDelete']);
      }}
      onClick={() => openInfo(props)}
    >
      <div className="w-full h-full relative">
        <div
          className={`w-full h-full ${
            imageMode ? 'overflow-hidden' : 'overflow-scroll no-scrollbar'
          } p-2`}
        >
          <p
            className={`${
              imageMode ? 'text-md font-normal' : 'text-sm font-semibold'
            } m-0 p-0 text-black dark:text-white`}
          >
            {subject} {number}
            {section.component !== 'LEC' && (
              <>
                {' '}
                <span className="font-medium text-xs text-gray-600 dark:text-gray-400">
                  (
                  {Utility.convertSectionComponent(
                    section.component
                  ).toUpperCase()}
                  )
                </span>
              </>
            )}
          </p>
          <p className={`text-xs m-0 text-black dark:text-white text-light`}>
            {title}
          </p>
          <p className="m-0 text-xs text-gray-500 dark:text-gray-300 opacity-75 font-light">
            {instructorLastNames}
          </p>
        </div>
        {switches.get.show_times && (
          <p
            className={`m-0 text-right text-xs absolute bottom-1 right-1 text-${color}-500 dark:text-${color}-300 opacity-60 dark:opacity-90 font-semibold`}
          >
            {Utility.convertTime(start_time!) +
              ' - ' +
              Utility.convertTime(end_time!)}
          </p>
        )}
      </div>
      <button
        className={`absolute -top-2 -right-2 p-0.5 rounded-full
                    ${
                      interactions?.hoverSection.get === section.section_id &&
                      interactions?.hoverDelete.get
                        ? 'block text-red-400 bg-red-100 dark:bg-gray-700 opacity-100'
                        : 'hidden bg-gray-200 opacity-80 text-gray-500 dark:text-white'
                    }
                    hover:bg-red-100 dark:bg-gray-700 text-xs
                    hover:text-red-400 dark:hover:text-red-400 hover:opacity-100
                    transition-all duration-150 group-hover:block z-20`}
        onMouseEnter={() => {
          if (interactions?.hoverSection.get === section.section_id) {
            interactions?.hoverDelete.set(true);
          }
        }}
        onMouseLeave={() => {
          interactions?.hoverDelete.clear();
        }}
        onClick={(e) => {
          e.stopPropagation();
          sf.removeSection(section);
          interactions?.multiClear(['hoverSection', 'hoverDelete']);
        }}
      >
        <TrashIcon className="w-5 h-5" />
      </button>
    </div>
  );
}

export default ScheduleClass;
