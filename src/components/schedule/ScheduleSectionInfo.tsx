import {
  AcademicCapIcon,
  BuildingLibraryIcon,
  CalendarDaysIcon,
  ChevronRightIcon,
  ClockIcon,
  DocumentCheckIcon,
  HashtagIcon,
  InformationCircleIcon,
  ListBulletIcon,
  MapPinIcon,
  PuzzlePieceIcon,
  Squares2X2Icon,
  TagIcon,
  UserIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';
import { MapIcon } from '@heroicons/react/24/solid';
import { ReactNode } from 'react';
import { Alert } from '@/types/AlertTypes';
import { IconElement } from '@/types/BaseTypes';
import { Course } from '@/types/PlanTypes';
import {
  ScheduleBookmarks,
  ScheduleInteractions,
  ScheduleModificationFunctions,
  ScheduleSection,
  ScheduleSectionBlock,
} from '@/types/ScheduleTypes';
import { SearchModificationFunctions } from '@/types/SearchTypes';
import {
  AnySideCardButtonData,
  SideCard,
  SideCardData,
  SideCardItemData,
} from '@/types/SideCardTypes';
import { getTermName } from '@/app/Data';
import RatingsTag from '../rating/RatingsTag';
import { OpenRatingsFn } from '@/types/RatingTypes';
import { Days } from '@/utility/Constants';
import {
  getCourse,
  getCourseColor,
  getOfferings,
  getOfferingsOrganized,
} from '@/app/Plan';
import {
  capitalizeFirstLetter,
  cleanEnrollmentRequirements,
  convertAllDaysToString,
  convertDisciplines,
  convertDistros,
  convertSectionComponent,
  convertTime,
  getTermColor,
  objAsAlertExtras,
} from '@/utility/Utility';
import { getCourseById, getRoomFinderLink } from '@/app/Schedule';

function getDetails(
  detail: string,
  section: ScheduleSection,
  course?: Course,
  alert?: Alert,
  interactions?: ScheduleInteractions
): [IconElement, ReactNode] | undefined {
  const offerings = course ? getOfferings(course).slice(0, 8) : undefined;
  switch (detail) {
    case 'TOPIC': {
      return [TagIcon, section.topic];
    }
    case 'SECTION NUMBER': {
      return [HashtagIcon, section.section];
    }
    case 'COMPONENT': {
      return [
        PuzzlePieceIcon,
        capitalizeFirstLetter(convertSectionComponent(section.component)),
      ];
    }
    case 'TIME SLOT': {
      return [
        ClockIcon,
        section.meeting_days.map((day, i) =>
          day && section.start_time[i] && section.end_time[i] ? (
            <p key={`section-info-time-${i}`}>
              {convertAllDaysToString(day)}{' '}
              {convertTime(section.start_time[i]!, true)} -{' '}
              {convertTime(section.end_time[i]!, true)}
            </p>
          ) : undefined
        ),
      ];
    }
    case 'INSTRUCTOR': {
      return [
        UserIcon,
        section.instructors?.map((instructor, i) => (
          <button
            className="m-1 underline
              underline-offset-4 hover:text-rose-500
              active:text-rose-600 dark:hover:text-rose-300 dark:active:text-rose-200"
            key={`section-info-instructor-${i}`}
            onClick={() => {
              alert?.({
                icon: UserIcon,
                title: instructor.name ?? 'No name',
                subtitle: `${section.subject}${
                  section.number ? ` ${section.number}` : ''
                }${section.section ? ` (section ${section.section})` : ''}`,
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
    }
    case 'LOCATION': {
      let roomFinderLinkExists = false;
      return [
        MapPinIcon,
        <>
          {section.room.map((room, i) => {
            room = room || 'None';
            let roomFinderLink: string | null = null;
            if (room) {
              roomFinderLink = getRoomFinderLink(room);
              if (roomFinderLink) roomFinderLinkExists = true;
            }

            return (
              <button
                className={`my-1 inline-flex items-center justify-center gap-1 underline underline-offset-4 ${
                  roomFinderLink
                    ? 'cursor-pointer hover:text-emerald-500 active:text-emerald-600 dark:hover:text-emerald-300 dark:active:text-emerald-200'
                    : 'cursor-default decoration-dotted hover:text-emerald-800 dark:hover:text-emerald-100'
                }`}
                onMouseEnter={() => {
                  if (interactions)
                    interactions.hoverLocation.set([
                      room,
                      section.color || getCourseColor(section.subject),
                    ]);
                }}
                onMouseLeave={() => {
                  if (interactions) interactions.hoverLocation.clear();
                }}
                onClick={() => {
                  if (roomFinderLink) {
                    if (interactions) interactions.hoverLocation.clear();
                    window.open(roomFinderLink, '_blank');
                  }
                }}
                key={`section-info-location-${i}`}
              >
                <p
                  className={`underline underline-offset-4 ${
                    roomFinderLink ? '' : 'decoration-dotted'
                  }`}
                >
                  {room}
                </p>
                {roomFinderLink && <MapIcon className="h-4 w-4" />}
              </button>
            );
          })}
          {roomFinderLinkExists && (
            <div className="flex items-center justify-center gap-1 text-xs font-bold text-gray-400 dark:text-gray-600">
              <MapIcon className="h-3 w-3" />
              <p>ROOM FINDER LINK</p>
            </div>
          )}
        </>,
      ];
    }
    case 'START/END DATES': {
      return [
        CalendarDaysIcon,
        section.start_date && section.end_date
          ? `${section.start_date} to ${section.end_date}`
          : undefined,
      ];
    }
    case 'RECENT OFFERINGS': {
      return [
        Squares2X2Icon,
        offerings ? (
          <>
            <p className="text-sm">
              {offerings.length > 0
                ? offerings.join(', ')
                : 'Not offered recently'}
            </p>
            <button
              className="inline-flex items-center text-xs font-bold text-gray-400 hover:text-purple-500 active:text-purple-600 dark:text-gray-500 dark:hover:text-purple-300 dark:active:text-purple-200"
              onClick={() => {
                alert?.({
                  icon: Squares2X2Icon,
                  title: 'Historic Offerings',
                  subtitle: course?.id,
                  message: `All offerings for ${course?.id} since 2020 Fall.`,
                  color: 'purple',
                  cancelButton: 'Close',
                  extras: course
                    ? objAsAlertExtras(getOfferingsOrganized(course), (a, b) =>
                        b.localeCompare(a)
                      )
                    : undefined,
                });
              }}
            >
              <span>VIEW ALL OFFERINGS</span>
              <ChevronRightIcon className="h-4 w-4 stroke-2" />
            </button>
          </>
        ) : undefined,
      ];
    }
    case 'PREREQUISITES': {
      return [ListBulletIcon, course?.prereqs];
    }
    case 'FOUNDATIONAL DISCIPLINES': {
      return [
        BuildingLibraryIcon,
        section?.disciplines
          ? convertDisciplines(section.disciplines).join(', ')
          : undefined,
      ];
    }
    case 'DISTRIBUTION AREAS': {
      return [
        BuildingLibraryIcon,
        section?.distros
          ? convertDistros(section.distros).join(', ')
          : undefined,
      ];
    }
    case 'UNITS': {
      return [AcademicCapIcon, course?.units];
    }
    case 'CAPACITY': {
      return [UsersIcon, section.capacity];
    }
    case 'ENROLLMENT REQUIREMENTS': {
      return [DocumentCheckIcon, cleanEnrollmentRequirements(section.enrl_req)];
    }
    case 'DESCRIPTIONS': {
      return [
        InformationCircleIcon,
        section?.descs ? (
          <div className="flex flex-col gap-2">
            {section.descs.map(([name, value], i) => (
              <div key={`section-info-desc-${i}`}>
                <p>{name}</p>
                <p className="text-left text-sm font-light">{value}</p>
              </div>
            ))}
          </div>
        ) : undefined,
      ];
    }
  }
}

interface SectionModificationWithinInfo {
  bookmarks?: ScheduleBookmarks;
  sf?: ScheduleModificationFunctions;
  ff: SearchModificationFunctions;
}

export function openInfo(
  sideCard: SideCard,
  alert: Alert,
  openRatings: OpenRatingsFn,
  { section, day, start_time, end_time }: ScheduleSectionBlock,
  interactions?: ScheduleInteractions,
  mod?: SectionModificationWithinInfo
) {
  const name = `${section.subject}${
    section.number ? ` ${section.number}` : ''
  }`;
  const course = !section.custom ? getCourse(name) : undefined;
  const scheduleCourse = getCourseById(section.section_id.split('-')[0]);

  const items = [
    'TOPIC',
    'SECTION NUMBER',
    'COMPONENT',
    'TIME SLOT',
    'INSTRUCTOR',
    'LOCATION',
    'START/END DATES',
    'RECENT OFFERINGS',
    'PREREQUISITES',
    'FOUNDATIONAL DISCIPLINES',
    'DISTRIBUTION AREAS',
    'UNITS',
    'CAPACITY',
    'ENROLLMENT REQUIREMENTS',
    'DESCRIPTIONS',
  ];

  let sideCardButtons: AnySideCardButtonData[] | undefined = undefined;

  // TODO organize this messy logic, it's 1:30 AM and I'm a bit tired rn
  if (mod) {
    sideCardButtons = [];
    if (section.custom && mod.sf) {
      sideCardButtons.push({
        text: 'Edit custom section',
        onClick: (close) => {
          mod.sf!.putCustomSection(section);
          close();
        },
      });
    } else {
      if (scheduleCourse && mod.bookmarks && mod.sf) {
        sideCardButtons.push({
          toggle: true,
          data: mod.bookmarks,
          key: scheduleCourse,
          indexProperty: 'course_id',
          enabled: {
            text: 'Remove from bookmarks',
            onClick: () => {
              mod.sf!.removeScheduleBookmark(scheduleCourse);
            },
          },
          disabled: {
            text: 'Add to bookmarks',
            onClick: () => {
              mod.sf!.addScheduleBookmark(scheduleCourse);
            },
          },
        });
      }
    }

    if (mod.sf) {
      sideCardButtons.push({
        text: 'Remove section',
        danger: true,
        onClick: (close) => {
          mod.sf!.removeSection(section);
          close();
        },
      });

      if (!section.custom) {
        sideCardButtons.push('divider');

        const overrides = mod.sf.checkOverrides(section);

        if (day !== undefined && start_time && end_time) {
          const disabled =
            overrides.timesRemaining && overrides.timesRemaining.length <= 1;
          sideCardButtons.push({
            text: `Hide ${Days[day]} ${convertTime(
              start_time,
              true
            )} - ${convertTime(end_time, true)}`,
            disabled,
            disabledText: disabled
              ? 'This is the only visible time.'
              : undefined,
            onClick: (close) => {
              mod.sf!.addOverride({
                section_id: section.section_id,
                day,
                start_time,
                end_time,
                hide: true,
              });
              close();
            },
          });
        }

        sideCardButtons.push(
          {
            text: 'Show all hidden times',
            disabled: !overrides.anyOverride,
            disabledText: !overrides.anyOverride
              ? 'None of the times for this section are hidden.'
              : undefined,
            onClick: (close) => {
              mod.sf!.removeOverrides(section.section_id);
              close();
            },
          },
          'divider'
        );
      }
    }

    if (!section.custom || !mod.sf) {
      sideCardButtons.push({
        text: mod.sf
          ? `Show all sections of ${name}`
          : `Show sections of ${name} in current term`,
        onClick: (close) => {
          mod.ff.set(name, scheduleCourse?.course_id);
          close();
        },
      });
    }
  }

  const termName = section.termId && getTermName(section.termId);

  const sideCardData: SideCardData = {
    type: section.custom
      ? 'SECTION INFO (CUSTOM)'
      : mod
      ? mod.sf
        ? 'SECTION INFO'
        : 'SECTION INFO (SHARE)'
      : 'SECTION INFO (SEARCH)',
    themeColor: getCourseColor(name),
    title: name,
    subtitle: section.title,
    message: course?.description ?? 'No course description available',
    toolbar: !section.custom ? (
      <RatingsTag course={name} alert={alert} openRatings={openRatings} />
    ) : undefined,
    items: items.reduce<SideCardItemData[]>((filtered, item) => {
      const [icon, value] =
        getDetails(item, section, course, alert, interactions) ?? [];
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
    link:
      !section.custom && section.termId
        ? `${window.location.origin}?s=${section.termId}-${section.section_id}`
        : undefined,
    tag: termName
      ? {
          text: termName.toUpperCase(),
          color: getTermColor(termName),
        }
      : undefined,
  };

  sideCard(sideCardData);
}
