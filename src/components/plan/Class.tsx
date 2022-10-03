import {
  AcademicCapIcon,
  BuildingLibraryIcon,
  ListBulletIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { useDrag } from 'react-dnd';
import PlanManager from '../../PlanManager';
import { IconElement, UserOptions } from '../../types/BaseTypes';
import {
  BookmarksData,
  Course,
  CourseDragItem,
  CourseDropResult,
  CourseLocation,
  DragCollectProps,
  PlanModificationFunctions,
} from '../../types/PlanTypes';
import {
  SideCard,
  SideCardData,
  SideCardItemData,
} from '../../types/SideCardTypes';
import Utility from '../../utility/Utility';

interface ClassProps {
  course: Course;
  bookmarks: BookmarksData;
  sideCard: SideCard;
  location: CourseLocation;
  f: PlanModificationFunctions;
  switches: UserOptions;
}

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
  }
}

function openInfo(props: ClassProps) {
  const {
    course,
    location,
    bookmarks,
    f: { removeCourse, addBookmark, removeBookmark },
  } = props;
  const placeholder = course.placeholder;

  const items = props.switches.get.course_info_details?.split(',') ?? [
    'PREREQUISITES',
    'DISTRIBUTION AREAS',
    'UNITS',
  ];

  const sideCardData: SideCardData = {
    type: 'COURSE INFO',
    themeColor: PlanManager.getCourseColor(course.id),
    title: placeholder ? 'Placeholder' : course.id,
    subtitle: course.name,
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
    buttons: [
      {
        toggle: true,
        data: bookmarks.noCredit,
        key: course,
        enabled: {
          text: 'Remove from My List',
          onClick: () => {
            removeBookmark(course, false);
          },
        },
        disabled: {
          text: 'Add to My List',
          onClick: () => {
            addBookmark(course, false);
          },
        },
      },
      {
        text: 'Remove course',
        danger: true,
        onClick: (close) => {
          removeCourse(course, location);
          close();
        },
      },
    ],
  };

  props.sideCard(sideCardData);
}

const variants = {
  hidden: { y: -20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

function Class(props: ClassProps) {
  let course = props.course;

  const dragItem: CourseDragItem = {
    course,
    from: props.location,
  };

  const [{ isDragging }, drag] = useDrag<
    CourseDragItem,
    CourseDropResult,
    DragCollectProps
  >(() => {
    return {
      type: 'Class',
      item: dragItem,
      collect: (monitor) => ({ isDragging: monitor.isDragging() }),
    };
  });

  let color = PlanManager.getCourseColor(course.id);
  let showMoreInfo =
    props.switches.get.more_info && !props.switches.get.compact;
  let isPlaceholder = course.placeholder;
  let units = parseFloat(course.units);

  return (
    <motion.div variants={variants}>
      <div
        ref={drag}
        className={`p-2 rounded-lg bg-opacity-60 bg-${color}-100 dark:bg-gray-800
            border-2 border-${color}-300 border-opacity-60 overflow-visible w-full text-left compact:px-2 compact:py-05
            hover:shadow-md transition ease-in-out duration-300 transform hover:-translate-y-1 group ${
              isDragging ? 'cursor-grab' : 'cursor-pointer'
            }`}
        onClick={() => openInfo(props)}
      >
        <p
          className={`text-md ${
            isPlaceholder ? 'font-normal' : 'font-bold'
          } text-black dark:text-gray-50 compact:text-sm overflow-hidden whitespace-nowrap`}
        >
          {isPlaceholder ? course.name : course.id}
        </p>
        <p
          className={`text-xs ${
            isPlaceholder ? 'font-light' : 'font-normal'
          } text-black dark:text-gray-50 overflow-hidden w-full block whitespace-nowrap overflow-ellipsis compact:hidden`}
          title={course.name}
        >
          {isPlaceholder ? 'PLACEHOLDER' : course.name}
        </p>
        {showMoreInfo && (
          <div>
            {course.prereqs && (
              <div className="mt-4 text-gray-500 dark:text-gray-400">
                <p className="text-xs font-bold">PREREQUISITES</p>
                <p className="m-0 p-0 text-xs font-light whitespace-normal">
                  {course.prereqs}
                </p>
              </div>
            )}
            {course.distros && (
              <div className="mt-4 text-gray-500 dark:text-gray-400">
                <p className="text-xs font-bold">DISTRIBUTION AREAS</p>
                <p className="m-0 p-0 text-xs font-light whitespace-normal">
                  {Utility.convertDistros(course.distros).join(', ')}
                </p>
              </div>
            )}
            <div className="mt-1">
              <p className="text-xs text-right text-gray-500 dark:text-gray-400 font-light">
                <span className="font-medium">{units}</span>{' '}
                {units === 1 ? 'unit' : 'units'}
              </p>
            </div>
          </div>
        )}
        <button
          className="absolute -top-2 -right-2 p-0.5 rounded-full bg-gray-200 hover:bg-red-100 dark:bg-gray-700
                        text-gray-500 dark:text-white text-xs opacity-80 hover:text-red-400 dark:hover:text-red-400 hover:opacity-100
                        transition-all duration-150 hidden group-hover:block z-20"
          onClick={(e) => {
            e.stopPropagation();
            props.f.removeCourse(course, props.location);
          }}
        >
          <TrashIcon className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
}

export default Class;
