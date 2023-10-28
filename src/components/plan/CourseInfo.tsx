import {
  AcademicCapIcon,
  ArrowPathIcon,
  BuildingLibraryIcon,
  CalendarDaysIcon,
  ChevronRightIcon,
  ListBulletIcon,
} from '@heroicons/react/24/outline';
import PlanManager from '../../PlanManager';
import { IconElement } from '../../types/BaseTypes';
import {
  BookmarksData,
  Course,
  CourseLocation,
  PlanModificationFunctions,
} from '../../types/PlanTypes';
import {
  SideCard,
  SideCardData,
  SideCardItemData,
} from '../../types/SideCardTypes';
import Utility from '../../utility/Utility';
import { ReactNode } from 'react';
import { Alert } from '../../types/AlertTypes';

function getDetails(
  detail: string,
  course: Course,
  alert: Alert
): [IconElement, ReactNode] | undefined {
  const offerings = PlanManager.getOfferings(course).slice(0, 8);
  switch (detail) {
    case 'RECENT OFFERINGS':
      return [
        CalendarDaysIcon,
        course.custom ? undefined : (
          <>
            <p className="text-sm">
              {offerings.length > 0
                ? offerings.join(', ')
                : 'Not offered recently'}
            </p>
            <button
              className="inline-flex items-center text-xs font-bold text-gray-400 hover:text-purple-500 active:text-purple-600 dark:text-gray-500 dark:hover:text-purple-300 dark:active:text-purple-200"
              onClick={() => {
                alert({
                  icon: CalendarDaysIcon,
                  title: 'Historic Offerings',
                  subtitle: course.id,
                  message: `All offerings for ${course.id} since 2020 Fall.`,
                  color: 'purple',
                  cancelButton: 'Close',
                  extras: Utility.objAsAlertExtras(
                    PlanManager.getOfferingsOrganized(course),
                    (a, b) => b.localeCompare(a)
                  ),
                });
              }}
            >
              <span>VIEW ALL OFFERINGS</span>
              <ChevronRightIcon className="h-4 w-4 stroke-2" />
            </button>
          </>
        ),
      ];
    case 'PREREQUISITES':
      return [ListBulletIcon, course.prereqs];
    case 'FOUNDATIONAL DISCIPLINES':
      return [
        BuildingLibraryIcon,
        course.disciplines
          ? Utility.convertDisciplines(course.disciplines).join(', ')
          : undefined,
      ];
    case 'DISTRIBUTION AREAS':
      return [
        BuildingLibraryIcon,
        course.distros
          ? Utility.convertDistros(course.distros).join(', ')
          : undefined,
      ];
    case 'UNITS':
      return [AcademicCapIcon, parseFloat(course.units).toFixed(2).toString()];
    case 'REPEATABLE FOR CREDIT':
      return [ArrowPathIcon, course.repeatable ? 'Yes' : 'No'];
  }
}

interface PlanModificationWithinInfo {
  bookmarks: BookmarksData;
  location: CourseLocation;
  f: PlanModificationFunctions;
}

export function openInfo(
  sideCard: SideCard,
  alert: Alert,
  course: Course,
  fromSearch: boolean,
  mod?: PlanModificationWithinInfo
) {
  const placeholder = course.placeholder;

  const items = [
    'RECENT OFFERINGS',
    'PREREQUISITES',
    'FOUNDATIONAL DISCIPLINES',
    'DISTRIBUTION AREAS',
    'UNITS',
    'REPEATABLE FOR CREDIT',
  ];

  const sideCardData: SideCardData = {
    type: course.custom
      ? 'COURSE INFO (CUSTOM)'
      : mod
      ? 'COURSE INFO'
      : fromSearch
      ? 'COURSE INFO (SEARCH)'
      : 'COURSE INFO (SHARE)',
    themeColor: PlanManager.getCourseColor(course.id),
    title: placeholder ? 'Placeholder' : course.id,
    subtitle: course.name,
    alertMessage: course.legacy
      ? "This course is no longer in the Northwestern course catalog. It will not appear in search results unless the 'Include Legacy Courses' filter is applied."
      : undefined,
    message: placeholder
      ? `If you aren't sure which course to take to fulfill a certain requirement, you can use a placeholder! Search using 'placeholder' or by requirement category to find placeholders.`
      : course.description,
    items: items.reduce<SideCardItemData[]>((filtered, item) => {
      const [icon, value] = getDetails(item, course, alert) ?? [];
      if (value) {
        filtered.push({
          key: item,
          icon,
          value,
        });
      }
      return filtered;
    }, []),
    buttons: mod
      ? [
          course.custom
            ? {
                text: 'Edit custom course',
                onClick: (close) => {
                  mod.f.putCustomCourse(mod.location, course);
                  close();
                },
              }
            : {
                toggle: true,
                data: mod.bookmarks.noCredit,
                key: course,
                enabled: {
                  text: 'Remove from bookmarks',
                  onClick: () => {
                    mod.f.removeBookmark(course, false);
                  },
                },
                disabled: {
                  text: 'Add to bookmarks',
                  onClick: () => {
                    mod.f.addBookmark(course, false);
                  },
                },
              },
          {
            text: 'Remove course',
            danger: true,
            onClick: (close) => {
              mod.f.removeCourse(course, mod.location);
              close();
            },
          },
        ]
      : undefined,
    link: !course.custom
      ? `${window.location.origin}?c=${encodeURIComponent(course.id)}`
      : undefined,
  };

  sideCard(sideCardData);
}
