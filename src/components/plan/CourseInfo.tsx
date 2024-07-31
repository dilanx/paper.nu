import { getCourseColor } from '@/app/Plan';
import RatingsTag from '@/components/rating/RatingsTag';
import { AppContext, IconElement } from '@/types/BaseTypes';
import {
  BookmarksData,
  Course,
  CourseLocation,
  PlanModificationFunctions,
} from '@/types/PlanTypes';
import { SideCardData, SideCardItemData } from '@/types/SideCardTypes';
import { convertDisciplines, convertDistros } from '@/utility/Utility';
import {
  AcademicCapIcon,
  ArrowPathIcon,
  BuildingLibraryIcon,
  CalculatorIcon,
  ListBulletIcon,
  Squares2X2Icon,
  TagIcon,
} from '@heroicons/react/24/outline';
import { ReactNode } from 'react';
import RecentOfferings from '../info/RecentOfferings';
import School from '../info/School';
import RecentTopics from '../info/RecentTopics';
import TopicSelect from './TopicSelect';

function getDetails(
  detail: string,
  course: Course,
  isOnPlan: boolean
): [IconElement, ReactNode] | undefined {
  switch (detail) {
    case 'TOPIC': {
      return [
        TagIcon,
        !isOnPlan ||
        course.custom ||
        course.placeholder ||
        !course.topics ||
        course.topics.length === 0 ? undefined : (
          <TopicSelect />
        ),
      ];
    }
    case 'RECENT OFFERINGS': {
      return [
        Squares2X2Icon,
        course.custom || course.placeholder ? undefined : (
          <RecentOfferings course={course} />
        ),
      ];
    }
    case 'RECENT TOPICS': {
      return [
        TagIcon,
        course.custom ||
        course.placeholder ||
        !course.topics ||
        course.topics.length === 0 ? undefined : (
          <RecentTopics course={course} />
        ),
      ];
    }
    case 'PREREQUISITES': {
      return [ListBulletIcon, course.prereqs];
    }
    case 'FOUNDATIONAL DISCIPLINES': {
      return [
        BuildingLibraryIcon,
        course.disciplines
          ? convertDisciplines(course.disciplines).join(', ')
          : undefined,
      ];
    }
    case 'DISTRIBUTION AREAS': {
      return [
        BuildingLibraryIcon,
        course.distros ? convertDistros(course.distros).join(', ') : undefined,
      ];
    }
    case 'UNITS': {
      return [CalculatorIcon, parseFloat(course.units).toFixed(2).toString()];
    }
    case 'REPEATABLE FOR CREDIT': {
      return [ArrowPathIcon, course.repeatable ? 'Yes' : 'No'];
    }
    case 'SCHOOL': {
      return [
        AcademicCapIcon,
        course.school ? <School school={course.school} /> : undefined,
      ];
    }
  }
}

interface PlanModificationWithinInfo {
  bookmarks: BookmarksData;
  location: CourseLocation;
  planModification: PlanModificationFunctions;
}

export function openInfo(
  course: Course,
  appContext: AppContext,
  fromSearch: boolean,
  mod?: PlanModificationWithinInfo
) {
  const placeholder = course.placeholder;

  const items = [
    'TOPIC',
    'RECENT TOPICS',
    'RECENT OFFERINGS',
    'PREREQUISITES',
    'FOUNDATIONAL DISCIPLINES',
    'DISTRIBUTION AREAS',
    'UNITS',
    'REPEATABLE FOR CREDIT',
    'SCHOOL',
  ];

  const sideCardData: SideCardData = {
    type: course.custom
      ? 'COURSE INFO (CUSTOM)'
      : mod
      ? 'COURSE INFO'
      : fromSearch
      ? 'COURSE INFO (SEARCH)'
      : 'COURSE INFO (SHARE)',
    themeColor: getCourseColor(course.id),
    title: placeholder ? 'Placeholder' : course.id,
    subtitle: course.name,
    alertMessage: course.legacy
      ? "This course is no longer in the Northwestern course catalog. It will not appear in search results unless the 'Include Legacy Courses' filter is applied."
      : undefined,
    message: placeholder
      ? `If you aren't sure which course to take to fulfill a certain requirement, you can use a placeholder! Search using 'placeholder' or by requirement category to find placeholders.`
      : course.description,
    toolbar:
      !course.custom && !course.placeholder ? (
        <RatingsTag course={course.id} />
      ) : undefined,
    items: items.reduce<SideCardItemData[]>((filtered, item) => {
      const [icon, value] =
        getDetails(
          item,
          course,
          !course.custom && !course.placeholder && !!mod
        ) ?? [];
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
                  mod.planModification.putCustomCourse(mod.location, course);
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
                    mod.planModification.removeBookmark(course, false);
                  },
                },
                disabled: {
                  text: 'Add to bookmarks',
                  onClick: () => {
                    mod.planModification.addBookmark(course, false);
                  },
                },
              },
          {
            text: 'Remove course',
            danger: true,
            onClick: (close) => {
              mod.planModification.removeCourse(course, mod.location);
              close();
            },
          },
        ]
      : undefined,
    link: !course.custom
      ? `${window.location.origin}?c=${encodeURIComponent(course.id)}`
      : undefined,
  };

  appContext.sideCard(sideCardData);
}
