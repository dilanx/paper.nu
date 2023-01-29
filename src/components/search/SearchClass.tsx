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

const PLACEHOLDER_MESSAGE = `Don't know which specific class to take from a certain requirement category? Use a placeholder! Search for 'placeholder' to view all.`;

interface SearchClassProps {
  course: Course;
  color: Color;
  select?: (course: Course) => void;
  bookmarks?: BookmarksData;
  f?: PlanModificationFunctions;
}

function SearchClass(props: SearchClassProps) {
  let course = props.course;

  let item: CourseDragItem = { course };

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'Class',
    item,
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  }));

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
      className={`rounded-lg bg-opacity-60 p-2 bg-${props.color}-100 rounded-lg
            border-2 dark:bg-gray-800 border-${props.color}-300 group m-4
            transform border-opacity-60 transition duration-300 ease-in-out hover:-translate-y-1 hover:shadow-md ${
              isDragging ? 'cursor-grab ' : 'cursor-default'
            }`}
      onClick={() => {
        if (props.select) props.select(course);
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
      {props.select && (
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
