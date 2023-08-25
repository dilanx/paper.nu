import {
  AcademicCapIcon,
  ArrowPathIcon,
  BuildingLibraryIcon,
  ListBulletIcon,
} from '@heroicons/react/24/outline';
import PlanManager from '../PlanManager';
import { IconElement } from '../types/BaseTypes';
import {
  BookmarksData,
  Course,
  CourseLocation,
  PlanModificationFunctions,
} from '../types/PlanTypes';
import {
  SideCard,
  SideCardData,
  SideCardItemData,
} from '../types/SideCardTypes';
import Utility from './Utility';

function getDetails(
  detail: string,
  course: Course
): [IconElement, string | undefined] | undefined {
  switch (detail) {
    case 'PREREQUISITES':
      return [ListBulletIcon, course.prereqs];
    case 'DISTRIBUTION AREAS':
      return [
        BuildingLibraryIcon,
        course.distros
          ? Utility.convertDistros(course.distros).join(', ')
          : undefined,
      ];
    case 'UNITS':
      return [AcademicCapIcon, course.units];
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
  course: Course,
  mod?: PlanModificationWithinInfo
) {
  const placeholder = course.placeholder;

  const items = [
    'PREREQUISITES',
    'DISTRIBUTION AREAS',
    'UNITS',
    'REPEATABLE FOR CREDIT',
  ];

  const sideCardData: SideCardData = {
    type: mod ? 'COURSE INFO' : 'COURSE INFO (SHARE)',
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
      const [icon, value] = getDetails(item, course) ?? [];
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
          {
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
