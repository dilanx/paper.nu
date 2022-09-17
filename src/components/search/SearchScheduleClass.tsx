import { BookmarkIcon, MinusIcon } from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkIconSolid } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';
import { useDrag } from 'react-dnd';
import { Color } from '../../types/BaseTypes';
import {
  ScheduleCourse,
  ScheduleData,
  ScheduleInteractions,
  ScheduleModificationFunctions,
} from '../../types/ScheduleTypes';
import { FilterOptions } from '../../types/SearchTypes';
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
      className={`p-2 rounded-lg bg-opacity-60 dark:bg-gray-800 border-2 relative
            ${
              props.selected
                ? `bg-white border-${props.color}-400 shadow-lg -translate-y-2`
                : `bg-${props.color}-100 border-${props.color}-300 border-opacity-60 hover:shadow-md hover:-translate-y-1`
            }
            group transition ease-in-out duration-300 m-4 cursor-pointer ${
              isDragging ? 'cursor-grab ' : 'cursor-pointer'
            }`}
      onClick={() => {
        if (props.select) props.select();
      }}
    >
      <p className="text-lg font-bold text-black dark:text-gray-50">
        {course.subject + ' ' + course.number}
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
                key={`search-${section.section_id}`}
              />
            );
          })}
          {hidden > 0 && (
            <p className="m-0 text-sm text-center text-gray-400 font-medium">
              {hidden} section{hidden > 1 ? 's' : ''} hidden by filter
            </p>
          )}
        </motion.div>
      )}

      {!props.selected && (
        <button
          className="absolute -top-2 -right-2 p-1 rounded-full bg-gray-200 hover:bg-indigo-100 dark:bg-gray-700
                        text-gray-500 dark:text-white text-xs opacity-80 hover:text-indigo-400 dark:hover:text-indigo-400 hover:opacity-100
                        transition-all duration-150 hidden group-hover:block z-20"
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
              <MinusIcon className="w-5 h-5" />
            ) : (
              <BookmarkIconSolid className="w-5 h-5" />
            )
          ) : (
            <BookmarkIcon className="w-5 h-5" />
          )}
        </button>
      )}
    </div>
  );
}

export default SearchScheduleClass;
