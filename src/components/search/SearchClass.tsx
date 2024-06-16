import { useApp, useData, useModification } from '@/app/Context';
import { getOfferings } from '@/app/Plan';
import ClassPropertyDisplay from '@/components/plan/ClassPropertyDisplay';
import { openInfo } from '@/components/plan/CourseInfo';
import { Color } from '@/types/BaseTypes';
import { Course, CourseDragItem } from '@/types/PlanTypes';
import { convertDisciplines, convertDistros } from '@/utility/Utility';
import { BookmarkIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkIconSolid } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';
import { useDrag } from 'react-dnd';
import AddButtons from './AddButtons';

const PLACEHOLDER_MESSAGE = `Don't know which specific class to take from a certain requirement category? Use a placeholder! Search for 'placeholder' to view all.`;

interface SearchClassProps {
  course: Course;
  color: Color;
  select: (course: string) => void;
  selected: boolean;
}

function SearchClass({ course, color, select, selected }: SearchClassProps) {
  const app = useApp();
  const {
    plan: { courses, bookmarks },
  } = useData();
  const { planModification } = useModification();
  const item: CourseDragItem = { course };

  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: 'Class',
      item,
      canDrag: !selected,
      collect: (monitor) => ({ isDragging: monitor.isDragging() }),
    }),
    [selected]
  );

  const recentOfferings = getOfferings(course).slice(0, 8);
  const distroStrings = convertDistros(course.distros);
  const disciplinesStrings = convertDisciplines(course.disciplines);
  const isPlaceholder = course.placeholder;
  const units = parseFloat(course.units);
  const isFavorite = bookmarks?.noCredit.has(course);
  return (
    <div
      ref={drag}
      className={`rounded-lg border-2 bg-opacity-60 p-2 dark:bg-gray-800 ${
        selected
          ? `bg-white border-${color}-400 -translate-y-2 cursor-default shadow-lg`
          : `bg-${color}-100 border-${color}-300 border-opacity-60 hover:-translate-y-1 hover:shadow-md ${
              isDragging ? 'cursor-grabbing' : 'cursor-pointer'
            }`
      }
            group m-4 transition duration-300 ease-in-out`}
      onClick={() => {
        select(course.id);
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

      {selected && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25, duration: 0.2 }}
        >
          <AddButtons
            action={(year, quarter) => {
              planModification.addCourse(course, {
                year,
                quarter,
              });
            }}
            courses={courses}
          />
          <div className="py-2">
            <button
              className="mx-auto my-2 block w-4/5 rounded-md bg-indigo-500 p-0.5 font-medium text-white opacity-100 shadow-sm hover:opacity-75 active:opacity-50"
              onClick={(e) => {
                e.stopPropagation();
                if (bookmarks.noCredit.has(course)) {
                  planModification.removeBookmark(course, false);
                } else {
                  planModification.addBookmark(course, false);
                }
              }}
            >
              {bookmarks.noCredit.has(course)
                ? 'Remove from bookmarks'
                : 'Add to bookmarks'}
            </button>
            <button
              className="mx-auto my-2 block w-4/5 rounded-md bg-indigo-800 p-0.5 font-medium text-white opacity-100 shadow-sm hover:opacity-75 active:opacity-50 dark:bg-indigo-400"
              onClick={(e) => {
                e.stopPropagation();
                if (bookmarks.forCredit.has(course)) {
                  planModification.removeBookmark(course, true);
                } else {
                  planModification.addBookmark(course, true);
                }
              }}
            >
              {bookmarks.forCredit.has(course)
                ? 'Remove for credit'
                : 'Add for credit'}
            </button>
          </div>
          <button
            className="mx-auto my-2 flex items-center text-xs font-bold text-gray-400 hover:text-gray-500 active:text-gray-600 dark:text-gray-500 dark:hover:text-gray-400 dark:active:text-gray-300"
            onClick={(e) => {
              e.stopPropagation();
              openInfo(course, app, true);
            }}
          >
            <span>VIEW MORE INFO</span>
            <ChevronRightIcon className="h-4 w-4 stroke-2" />
          </button>
        </motion.div>
      )}

      {!selected && (
        <button
          className="absolute -right-2 -top-2 z-20 hidden rounded-full bg-gray-200 p-1
                    text-xs text-gray-500 opacity-80 transition-all duration-150 hover:bg-indigo-100 hover:text-indigo-400
                    hover:opacity-100 group-hover:block dark:bg-gray-700 dark:text-white dark:hover:text-indigo-400"
          onClick={(e) => {
            e.stopPropagation();
            if (isFavorite) {
              planModification.removeBookmark(course, false);
            } else {
              planModification.addBookmark(course, false);
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
