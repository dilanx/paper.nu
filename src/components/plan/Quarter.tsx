import { motion } from 'framer-motion';
import { useDrop } from 'react-dnd';
import PlanManager from '../../PlanManager';
import { Color, UserOptions } from '../../types/BaseTypes';
import {
  BookmarksData,
  Course,
  CourseDragItem,
  CourseDropResult,
  CourseLocation,
  DropCollectedProps,
  PlanModificationFunctions,
} from '../../types/PlanTypes';
import { SideCard } from '../../types/SideCardTypes';
import Class from './Class';

interface QuarterProps {
  data: Course[];
  bookmarks: BookmarksData;
  location: CourseLocation;
  f: PlanModificationFunctions;
  sideCard: SideCard;
  switches: UserOptions;
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
        props.f.moveCourse(item.course, item.from, props.location);
      } else {
        props.f.addCourse(item.course, props.location);
      }
      return { moved: true };
    },
    collect: (monitor) => ({ isOver: monitor.isOver() }),
  }));

  let courses = props.data;
  let classes: JSX.Element[] | JSX.Element = [];
  if (courses) {
    if (courses.length > 0) {
      classes = courses.map((classData, index) => {
        return (
          <Class
            course={classData}
            bookmarks={props.bookmarks}
            sideCard={props.sideCard}
            location={props.location}
            f={props.f}
            switches={props.switches}
            key={classData.id + '-' + index}
          />
        );
      });
    } else {
      classes = (
        <div
          className="overflow-hidden whitespace-nowrap rounded-lg border-2 border-dashed border-black bg-white p-2 opacity-40 compact:px-2
                    compact:py-0.5 dark:border-gray-500 dark:bg-gray-900"
        >
          <p className="text-md font-bold text-black dark:text-white">
            No classes to show.
          </p>
          <p className="text-xs compact:hidden dark:text-white">
            Use the search bar.
          </p>
        </div>
      );
    }
  }

  let units = PlanManager.getQuarterCredits(courses);

  let unitString = 'units';
  if (units === 1) {
    unitString = 'unit';
  }

  return (
    <motion.div variants={variants}>
      <div
        ref={drop}
        className={`relative block rounded-lg border-2 px-8 pt-4 pb-8
            ${
              isOver
                ? `border-dashed border-emerald-500 bg-emerald-300 bg-opacity-50`
                : `border-solid bg-${props.color}-50 dark:bg-gray-800 border-${props.color}-400`
            }
                h-full space-y-3 shadow-lg compact:py-2 compact:shadow-sm ${
                  props.yearHasSummer ? 'lg:px-4' : ''
                }`}
      >
        <p className="text-md m-0 p-0 text-center font-bold text-gray-600 compact:text-sm dark:text-gray-400">
          {props.title}
        </p>
        {classes}
        {props.switches.get.quarter_units && (
          <p className="absolute right-2 top-0 m-0 p-0 text-right text-xs font-normal text-gray-400">
            <span className="font-medium">{units}</span> {unitString}
          </p>
        )}
      </div>
    </motion.div>
  );
}

export default Quarter;
