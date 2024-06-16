import { useApp, useData, useModification } from '@/app/Context';
import { getCourseColor } from '@/app/Plan';
import {
  Course,
  CourseDragItem,
  CourseDropResult,
  CourseLocation,
  DragCollectProps,
} from '@/types/PlanTypes';
import { convertDistros } from '@/utility/Utility';
import { TrashIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { useDrag } from 'react-dnd';
import ClassPropertyDisplay from './ClassPropertyDisplay';
import { openInfo } from './CourseInfo';

interface ClassProps {
  course: Course;
  location: CourseLocation;
}

const variants = {
  hidden: { y: -20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

function Class({ course, location }: ClassProps) {
  const app = useApp();
  const {
    plan: { bookmarks },
  } = useData();
  const { planModification } = useModification();
  const { userOptions } = app;

  const [{ isDragging }, drag] = useDrag<
    CourseDragItem,
    CourseDropResult,
    DragCollectProps
  >(() => {
    const dragItem: CourseDragItem = {
      course,
      from: location,
    };

    return {
      type: 'Class',
      item: dragItem,
      collect: (monitor) => ({ isDragging: monitor.isDragging() }),
    };
  }, [course]);

  const custom = course.custom;
  const color = course.color || getCourseColor(course.id);
  const showMoreInfo = userOptions.get.more_info && !userOptions.get.compact;
  const isPlaceholder = course.placeholder;
  const units = parseFloat(course.units);

  return (
    <motion.div variants={variants}>
      <div
        ref={drag}
        className={`rounded-lg bg-opacity-60 p-2 active:opacity-50 bg-${color}-100 border-2
            dark:bg-gray-800 border-${color}-300 compact:py-05 group w-full transform overflow-visible border-opacity-60
            text-left transition duration-300 ease-in-out hover:-translate-y-1 hover:shadow-md compact:px-2 ${
              custom ? 'border-dashed' : 'border-solid'
            } ${isDragging ? 'cursor-grabbing' : 'cursor-pointer'}`}
        onClick={() =>
          openInfo(course, app, false, {
            bookmarks,
            location,
            planModification,
          })
        }
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
              <ClassPropertyDisplay
                title="PREREQUISITES"
                value={course.prereqs}
              />
            )}
            {course.distros && (
              <ClassPropertyDisplay
                title="DISTRIBUTION AREAS"
                value={convertDistros(course.distros).join(', ')}
              />
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
          className="absolute -right-2 -top-2 z-20 hidden rounded-full bg-gray-200 p-0.5
                        text-xs text-gray-500 opacity-80 transition-all duration-150 hover:bg-red-100 hover:text-red-400
                        hover:opacity-100 group-hover:block dark:bg-gray-700 dark:text-white dark:hover:text-red-400"
          onClick={(e) => {
            e.stopPropagation();
            planModification.removeCourse(course, location);
          }}
        >
          <TrashIcon className="h-5 w-5" />
        </button>
      </div>
    </motion.div>
  );
}

export default Class;
