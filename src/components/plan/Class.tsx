import {
  AcademicCapIcon,
  ArrowPathIcon,
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
    case 'REPEATABLE FOR CREDIT':
      return [ArrowPathIcon, course.repeatable ? 'Yes' : 'No'];
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
    'REPEATABLE FOR CREDIT',
  ];

  const sideCardData: SideCardData = {
    type: 'COURSE INFO',
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
    buttons: [
      {
        toggle: true,
        data: bookmarks.noCredit,
        key: course,
        enabled: {
          text: 'Remove from bookmarks',
          onClick: () => {
            removeBookmark(course, false);
          },
        },
        disabled: {
          text: 'Add to bookmarks',
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
        className={`rounded-lg bg-opacity-60 p-2 bg-${color}-100 border-2
            dark:bg-gray-800 border-${color}-300 compact:py-05 group w-full transform overflow-visible border-opacity-60
            text-left transition duration-300 ease-in-out hover:-translate-y-1 hover:shadow-md compact:px-2 ${
              isDragging ? 'cursor-grab' : 'cursor-default'
            }`}
        onClick={() => openInfo(props)}
      >
        <p
          className={`text-md ${
            isPlaceholder ? 'font-normal' : 'font-bold'
          } overflow-hidden whitespace-nowrap text-black compact:text-sm dark:text-gray-50`}
        >
          {isPlaceholder ? course.name : course.id}
        </p>
        <p
          className={`text-xs ${
            isPlaceholder ? 'font-light' : 'font-normal'
          } block w-full overflow-hidden overflow-ellipsis whitespace-nowrap text-black compact:hidden dark:text-gray-50`}
          title={course.name}
        >
          {isPlaceholder ? 'PLACEHOLDER' : course.name}
        </p>
        {showMoreInfo && (
          <div>
            {course.prereqs && (
              <div className="mt-4 text-gray-500 dark:text-gray-400">
                <p className="text-xs font-bold">PREREQUISITES</p>
                <p className="m-0 whitespace-normal p-0 text-xs font-light">
                  {course.prereqs}
                </p>
              </div>
            )}
            {course.distros && (
              <div className="mt-4 text-gray-500 dark:text-gray-400">
                <p className="text-xs font-bold">DISTRIBUTION AREAS</p>
                <p className="m-0 whitespace-normal p-0 text-xs font-light">
                  {Utility.convertDistros(course.distros).join(', ')}
                </p>
              </div>
            )}
            <div className="mt-1">
              <p className="text-right text-xs font-light text-gray-500 dark:text-gray-400">
                <span className="font-medium">{units}</span>{' '}
                {units === 1 ? 'unit' : 'units'}
              </p>
            </div>
          </div>
        )}
        <button
          className="absolute -top-2 -right-2 z-20 hidden rounded-full bg-gray-200 p-0.5
                        text-xs text-gray-500 opacity-80 transition-all duration-150 hover:bg-red-100 hover:text-red-400
                        hover:opacity-100 group-hover:block dark:bg-gray-700 dark:text-white dark:hover:text-red-400"
          onClick={(e) => {
            e.stopPropagation();
            props.f.removeCourse(course, props.location);
          }}
        >
          <TrashIcon className="h-5 w-5" />
        </button>
      </div>
    </motion.div>
  );
}

export default Class;
