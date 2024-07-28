import { useApp, useModification } from '@/app/Context';
import { getQuarterCredits } from '@/app/Plan';
import { Color } from '@/types/BaseTypes';
import {
  Course,
  CourseDragItem,
  CourseDropResult,
  CourseLocation,
  DropCollectedProps,
} from '@/types/PlanTypes';
import { PlusIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { useDrop } from 'react-dnd';
import Class from './Class';
import QuarterUtilityButton from './QuarterUtilityButton';

interface QuarterProps {
  data: Course[];
  location: CourseLocation;
  title: string;
  color: Color;
  yearHasSummer: boolean;
}

const variants = {
  hidden: { x: -20, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      when: 'beforeChildren',
    },
  },
};

function Quarter(props: QuarterProps) {
  const { userOptions } = useApp();
  const { planModification } = useModification();
  const [{ isOver }, drop] = useDrop<
    CourseDragItem,
    CourseDropResult,
    DropCollectedProps
  >(() => ({
    accept: 'Class',
    drop: (item, monitor) => {
      if (monitor.didDrop()) {
        return;
      }
      if (item.from) {
        planModification.moveCourse(item.course, item.from, props.location);
      } else {
        planModification.addCourse(item.course, props.location);
      }
      return { moved: true };
    },
    collect: (monitor) => ({ isOver: monitor.isOver() }),
  }));

  const courses = props.data;
  let classes: JSX.Element[] | JSX.Element = [];
  if (courses) {
    if (courses.length > 0) {
      classes = courses.map((classData, index) => {
        return (
          <Class
            course={classData}
            location={props.location}
            key={classData.id + '-' + index}
          />
        );
      });
    } else {
      classes = (
        <div className="text-center opacity-75">
          <p
            className={`text-sm font-medium text-${props.color}-500 dark:text-${props.color}-400`}
          >
            No classes to show.
          </p>
          <p className="text-xs text-gray-400 compact:hidden dark:text-gray-500">
            Use the search bar to find a class, then drag it here.
          </p>
        </div>
      );
    }
  }

  const units = getQuarterCredits(courses);

  let unitString = 'units';
  if (units === 1) {
    unitString = 'unit';
  }

  return (
    <motion.div variants={variants}>
      <div
        ref={drop}
        className={`group/quarter relative block rounded-xl border-2 px-8 pb-8 pt-4
            ${
              isOver
                ? `border-dashed border-emerald-500 bg-emerald-300 bg-opacity-50`
                : `border-solid bg-${props.color}-50 dark:bg-gray-800 border-${props.color}-400`
            }
                h-full space-y-3 shadow-md compact:py-2 compact:shadow-sm ${
                  props.yearHasSummer ? 'lg:px-4' : ''
                }`}
      >
        <p className="text-md m-0 p-0 text-center font-bold text-gray-600 compact:text-sm dark:text-gray-400">
          {props.title}
        </p>
        {classes}
        {userOptions.get.quarter_units && (
          <p className="absolute right-2 top-0 m-0 p-0 text-right text-xs font-normal text-gray-400">
            <span className="font-medium">{units}</span> {unitString}
          </p>
        )}
        <div className="absolute bottom-1 right-1 hidden transition-all duration-300 group-hover/quarter:block">
          <QuarterUtilityButton
            Icon={PlusIcon}
            onClick={() => {
              planModification.putCustomCourse(props.location);
            }}
          >
            CUSTOM
          </QuarterUtilityButton>
        </div>
      </div>
    </motion.div>
  );
}

export default Quarter;
