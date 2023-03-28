import Utility from '../../utility/Utility';
import { useDrag } from 'react-dnd';
import { BookmarkIcon } from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkIconSolid } from '@heroicons/react/24/solid';
import {
  Course,
  CourseDragItem,
  BookmarksData,
  PlanModificationFunctions,
} from '../../types/PlanTypes';
import { Color } from '../../types/BaseTypes';
import { motion } from 'framer-motion';
import AddButtons from './AddButtons';

const PLACEHOLDER_MESSAGE = `Don't know which specific class to take from a certain requirement category? Use a placeholder! Search for 'placeholder' to view all.`;

interface SearchClassProps {
  courses: Course[][][];
  course: Course;
  color: Color;
  select: (course: string) => void;
  bookmarks: BookmarksData;
  f: PlanModificationFunctions;
  selected: boolean;
}

function SearchClass(props: SearchClassProps) {
  let course = props.course;

  let item: CourseDragItem = { course };

  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: 'Class',
      item,
      canDrag: !props.selected,
      collect: (monitor) => ({ isDragging: monitor.isDragging() }),
    }),
    [props.selected]
  );

  let distros = [];
  let distroStrings = Utility.convertDistros(course.distros);

  for (let i = 0; i < distroStrings.length; i++) {
    distros.push(
      <p
        className="m-0 p-0 text-xs font-light text-gray-500 dark:text-gray-400"
        key={`distro-${i}`}
      >
        {distroStrings[i]}
      </p>
    );
  }

  let isPlaceholder = course.placeholder;
  let units = parseFloat(course.units);
  let isFavorite = props.bookmarks?.noCredit.has(course);
  return (
    <div
      ref={drag}
      className={`rounded-lg border-2 bg-opacity-60 p-2 dark:bg-gray-800 ${
        props.selected
          ? `bg-white border-${props.color}-400 -translate-y-2 shadow-lg`
          : `bg-${props.color}-100 border-${props.color}-300 border-opacity-60 hover:-translate-y-1 hover:shadow-md`
      }
            group m-4 transition duration-300 ease-in-out ${
              isDragging ? 'cursor-grab ' : 'cursor-default'
            }`}
      onClick={() => {
        if (props.select) props.select(course.id);
      }}
    >
      <p className="text-lg font-bold text-black dark:text-gray-50">
        {isPlaceholder ? course.name : course.id}
      </p>
      <p className="text-sm text-black dark:text-gray-50">
        {isPlaceholder ? 'PLACEHOLDER' : course.name}
      </p>
      <p className="mt-4 text-xs text-gray-700 dark:text-gray-300">
        {isPlaceholder ? PLACEHOLDER_MESSAGE : course.description}
      </p>
      {course.prereqs && (
        <div className="mt-4">
          <p className="text-xs font-bold text-gray-500 dark:text-gray-400">
            PREREQUISITES
          </p>
          <p className="m-0 p-0 text-xs font-light text-gray-500 dark:text-gray-400">
            {course.prereqs}
          </p>
        </div>
      )}
      {distros.length > 0 && (
        <div className="mt-4">
          <p className="text-xs font-bold text-gray-500 dark:text-gray-400">
            DISTRIBUTION AREAS
          </p>
          {distros}
        </div>
      )}
      <div className="mt-1">
        <p className="text-right text-xs font-light text-gray-500 dark:text-gray-400">
          <span className="font-medium">{units}</span>{' '}
          {units === 1 ? 'unit' : 'units'}
        </p>
      </div>

      {props.selected && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25, duration: 0.2 }}
        >
          <AddButtons
            action={(year, quarter) => {
              props.f.addCourse(course, {
                year,
                quarter,
              });
            }}
            courses={props.courses}
          />
          <div className="py-2">
            <p className="p-2 text-center text-sm font-bold text-gray-500">
              BOOKMARKS
            </p>
            <button
              className="mx-auto my-2 block w-4/5 rounded-md bg-indigo-500 p-0.5 font-medium text-white opacity-100 shadow-sm hover:opacity-75 active:opacity-50"
              onClick={(e) => {
                e.stopPropagation();
                if (props.bookmarks.noCredit.has(course)) {
                  props.f.removeBookmark(course, false);
                } else {
                  props.f.addBookmark(course, false);
                }
              }}
            >
              {props.bookmarks.noCredit.has(course)
                ? 'Remove from bookmarks'
                : 'Add to bookmarks'}
            </button>
            <button
              className="mx-auto my-2 block w-4/5 rounded-md bg-indigo-800 p-0.5 font-medium text-white opacity-100 shadow-sm hover:opacity-75 active:opacity-50 dark:bg-indigo-400"
              onClick={(e) => {
                e.stopPropagation();
                if (props.bookmarks.forCredit.has(course)) {
                  props.f.removeBookmark(course, true);
                } else {
                  props.f.addBookmark(course, true);
                }
              }}
            >
              {props.bookmarks.forCredit.has(course)
                ? 'Remove for credit'
                : 'Add for credit'}
            </button>
          </div>
        </motion.div>
      )}

      {!props.selected && (
        <button
          className="absolute -top-2 -right-2 z-20 hidden rounded-full bg-gray-200 p-1
                    text-xs text-gray-500 opacity-80 transition-all duration-150 hover:bg-indigo-100 hover:text-indigo-400
                    hover:opacity-100 group-hover:block dark:bg-gray-700 dark:text-white dark:hover:text-indigo-400"
          onClick={(e) => {
            e.stopPropagation();
            if (isFavorite) {
              props.f?.removeBookmark(course, false);
            } else {
              props.f?.addBookmark(course, false);
            }
          }}
        >
          {isFavorite ? (
            <BookmarkIconSolid className="h-5 w-5" />
          ) : (
            <BookmarkIcon className="h-5 w-5" />
          )}
        </button>
      )}
    </div>
  );
}

export default SearchClass;
