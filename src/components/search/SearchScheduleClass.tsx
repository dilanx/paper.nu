import { BookmarkIcon, MinusIcon } from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkIconSolid } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';
import { useDrag } from 'react-dnd';
import { Alert } from '../../types/AlertTypes';
import { Color } from '../../types/BaseTypes';
import {
  ScheduleCourse,
  ScheduleData,
  ScheduleInteractions,
  ScheduleModificationFunctions,
} from '../../types/ScheduleTypes';
import { FilterOptions } from '../../types/SearchTypes';
import { SideCard } from '../../types/SideCardTypes';
import SearchScheduleSection from './SearchScheduleSection';

interface SearchScheduleClassProps {
  course: ScheduleCourse;
  schedule: ScheduleData;
  color: Color;
  selected: boolean;
  select: () => void;
  sf: ScheduleModificationFunctions;
  interactions: ScheduleInteractions;
  fromBookmarks?: boolean;
  filter?: FilterOptions;
  sideCard: SideCard;
  alert: Alert;
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

function SearchScheduleClass(props: SearchScheduleClassProps) {
  const course = props.course;

  let item = { course };

  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: 'ScheduleClass',
      item,
      canDrag: !props.selected,
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [props.selected]
  );

  const isBookmarked =
    props.fromBookmarks ||
    props.schedule.bookmarks.some((bookmarkCourse) => {
      return bookmarkCourse.course_id === course.course_id;
    });

  let hidden = props.fromBookmarks ? 0 : course.hide_section_ids?.length ?? 0;

  return (
    <div
      ref={drag}
      className={`relative rounded-lg border-2 bg-opacity-60 p-2 dark:bg-gray-800
            ${
              props.selected
                ? `bg-white border-${props.color}-400 -translate-y-2 cursor-default shadow-lg`
                : `bg-${props.color}-100 border-${
                    props.color
                  }-300 border-opacity-60 hover:-translate-y-1 hover:shadow-md ${
                    isDragging ? 'cursor-grab' : 'cursor-pointer'
                  }`
            }
            group m-4 transition duration-300 ease-in-out`}
      onClick={() => {
        if (props.select) props.select();
      }}
    >
      <p className="text-lg font-bold text-black dark:text-gray-50">
        {`${course.subject}${course.number ? ` ${course.number}` : ''}`}
      </p>
      <p className="text-sm text-black dark:text-gray-50">{course.title}</p>

      {props.selected && (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={variants}
          className="px-2 py-4"
        >
          {course.sections.map((section) => {
            if (
              !props.fromBookmarks &&
              course.hide_section_ids?.includes(section.section_id)
            ) {
              return undefined;
            }
            return (
              <SearchScheduleSection
                section={section}
                color={props.color}
                sf={props.sf}
                interactions={props.interactions}
                alreadyAdded={section.section_id in props.schedule.schedule}
                sideCard={props.sideCard}
                alert={props.alert}
                key={`search-${section.section_id}`}
              />
            );
          })}
          {hidden > 0 && (
            <p className="m-0 text-center text-sm font-medium text-gray-400">
              {hidden} section{hidden > 1 ? 's' : ''} hidden by filter
            </p>
          )}
        </motion.div>
      )}

      {!props.selected && (
        <button
          className="absolute -top-2 -right-2 z-20 hidden rounded-full bg-gray-200 p-1
                        text-xs text-gray-500 opacity-80 transition-all duration-150 hover:bg-indigo-100 hover:text-indigo-400
                        hover:opacity-100 group-hover:block dark:bg-gray-700 dark:text-white dark:hover:text-indigo-400"
          onClick={(e) => {
            e.stopPropagation();
            if (isBookmarked) {
              props.sf?.removeScheduleBookmark(course);
            } else {
              props.sf?.addScheduleBookmark(course);
            }
          }}
        >
          {isBookmarked ? (
            props.fromBookmarks ? (
              <MinusIcon className="h-5 w-5" />
            ) : (
              <BookmarkIconSolid className="h-5 w-5" />
            )
          ) : (
            <BookmarkIcon className="h-5 w-5" />
          )}
        </button>
      )}
    </div>
  );
}

export default SearchScheduleClass;
