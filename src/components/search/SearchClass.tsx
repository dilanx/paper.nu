import { useDrag } from 'react-dnd';
import { BookmarkIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkIconSolid } from '@heroicons/react/24/solid';
import {
  Course,
  CourseDragItem,
  BookmarksData,
  PlanModificationFunctions,
} from '@/types/PlanTypes';
import { Color } from '@/types/BaseTypes';
import { motion } from 'framer-motion';
import AddButtons from './AddButtons';
import ClassPropertyDisplay from '@/components/plan/ClassPropertyDisplay';
import { SideCard } from '@/types/SideCardTypes';
import { Alert } from '@/types/AlertTypes';
import { openInfo } from '@/components/plan/CourseInfo';
import { OpenRatingsFn } from '@/types/RatingTypes';
import { getOfferings } from '@/app/Plan';
import { convertDisciplines, convertDistros } from '@/utility/Utility';

const PLACEHOLDER_MESSAGE = `Don't know which specific class to take from a certain requirement category? Use a placeholder! Search for 'placeholder' to view all.`;

interface SearchClassProps {
  courses: Course[][][];
  course: Course;
  color: Color;
  select: (course: string) => void;
  bookmarks: BookmarksData;
  f: PlanModificationFunctions;
  selected: boolean;
  sideCard: SideCard;
  alert: Alert;
  openRatings: OpenRatingsFn;
}

function SearchClass(props: SearchClassProps) {
  const course = props.course;

  const item: CourseDragItem = { course };

  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: 'Class',
      item,
      canDrag: !props.selected,
      collect: (monitor) => ({ isDragging: monitor.isDragging() }),
    }),
    [props.selected]
  );

  const recentOfferings = getOfferings(course).slice(0, 8);
  const distroStrings = convertDistros(course.distros);
  const disciplinesStrings = convertDisciplines(course.disciplines);
  const isPlaceholder = course.placeholder;
  const units = parseFloat(course.units);
  const isFavorite = props.bookmarks?.noCredit.has(course);
  return (
    <div
      ref={drag}
      className={`rounded-lg border-2 bg-opacity-60 p-2 dark:bg-gray-800 ${
        props.selected
          ? `bg-white border-${props.color}-400 -translate-y-2 cursor-default shadow-lg`
          : `bg-${props.color}-100 border-${
              props.color
            }-300 border-opacity-60 hover:-translate-y-1 hover:shadow-md ${
              isDragging ? 'cursor-grabbing' : 'cursor-pointer'
            }`
      }
            group m-4 transition duration-300 ease-in-out`}
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
        <ClassPropertyDisplay title="PREREQUISITES" value={course.prereqs} />
      )}
      <ClassPropertyDisplay
        title="RECENT OFFERINGS"
        value={
          recentOfferings.length > 0
            ? recentOfferings.join(', ')
            : 'Not offered recently'
        }
      />
      {disciplinesStrings.length > 0 && (
        <ClassPropertyDisplay
          title="FOUNDATIONAL DISCIPLINES"
          value={disciplinesStrings}
        />
      )}
      {distroStrings.length > 0 && (
        <ClassPropertyDisplay
          title="DISTRIBUTION AREAS"
          value={distroStrings}
        />
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
          <button
            className="mx-auto my-2 flex items-center text-xs font-bold text-gray-400 hover:text-gray-500 active:text-gray-600 dark:text-gray-500 dark:hover:text-gray-400 dark:active:text-gray-300"
            onClick={(e) => {
              e.stopPropagation();
              openInfo(
                props.sideCard,
                props.alert,
                props.openRatings,
                course,
                true
              );
            }}
          >
            <span>VIEW MORE INFO</span>
            <ChevronRightIcon className="h-4 w-4 stroke-2" />
          </button>
        </motion.div>
      )}

      {!props.selected && (
        <button
          className="absolute -right-2 -top-2 z-20 hidden rounded-full bg-gray-200 p-1
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
