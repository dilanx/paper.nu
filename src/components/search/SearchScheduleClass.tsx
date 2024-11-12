import { useApp, useData, useModification } from '@/app/Context';
import { Color } from '@/types/BaseTypes';
import { ScheduleCourse, ScheduleInteractions } from '@/types/ScheduleTypes';
import { FilterOptions } from '@/types/SearchTypes';
import {
  BookmarkIcon as BookmarkIconOutline,
  MinusIcon,
  ExclamationCircleIcon as ExclamationCircleIconOutline,
} from '@heroicons/react/24/outline';
import {
  BookmarkIcon as BookmarkIconSolid,
  ExclamationCircleIcon as ExclamationCircleIconSolid,
} from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';
import { useDrag } from 'react-dnd';
import SearchScheduleSection from './SearchScheduleSection';

interface SearchScheduleClassProps {
  course: ScheduleCourse;
  color: Color;
  selected: boolean;
  select: () => void;
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
  const { schedule } = useData();
  const { scheduleModification } = useModification();
  const { alert } = useApp();

  const course = props.course;

  const item = { course };

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
    schedule.bookmarks.some((bookmarkCourse) => {
      return bookmarkCourse.course_id === course.course_id;
    });

  const hidden = props.fromBookmarks ? 0 : course.hide_section_ids?.length ?? 0;

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
                    isDragging ? 'cursor-grabbing' : 'cursor-pointer'
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
          className="py px-2"
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
                interactions={props.interactions}
                alreadyAdded={section.section_id in schedule.schedule}
                key={`search-${section.section_id}`}
              />
            );
          })}
          {hidden > 0 && (
            <p className="m-0 text-center text-sm font-medium text-gray-400">
              {hidden} section{hidden > 1 ? 's' : ''} hidden by filter
            </p>
          )}
          <div className="flex justify-end">
            <button
              className={`text-2xs text-${props.color}-400 flex items-center gap-1 rounded-sm p-0.5 font-bold uppercase tracking-wide opacity-75 hover:bg-black/5 active:bg-black/10 dark:hover:bg-white/5 dark:active:bg-white/10`}
              onClick={(e) => {
                e.stopPropagation();
                alert({
                  title: 'Notice a missing section?',
                  color: 'red',
                  icon: ExclamationCircleIconOutline,
                  textHTML: (
                    <div className="flex flex-col gap-2">
                      <p>
                        There have been reports of some missing associated
                        sections for certain sections. This includes things like
                        some discussion sections attached to lecture sections,
                        or some lecture sessions attached to lab sections.
                      </p>
                      <p>
                        Unfortunately, the course data API that the school
                        provides to Paper is known for missing a lot of random
                        information. I've been contacting the registrar's office
                        since November 2023 and with follow-ups recently about
                        this issue, but sadly they'll respond only sometimes
                        saying they will look into it and other times I don't
                        hear back.
                      </p>
                      <p>
                        It's important to me to provide the most accurate
                        information for Paper users. Some things are very
                        outdated at the registrar (like what quarters courses
                        are typically offered) so Paper actually builds its own
                        data with its own historical data to provide this
                        information accurately. However, missing course data
                        from the registrar can't really be resolved by Paper
                        itself, so it's a bit of a waiting game for now.
                      </p>
                      <p>
                        Sorry about these issues! So many of you rely on Paper
                        for the accurate information on courses so I'll keep on
                        contacting the registrar until they respond and help me
                        fix this issue. In the meantime, you can add custom
                        sections to your schedule to account for these missing
                        sections. It's not ideal, I know, but hopefully just
                        temporary. Thanks for your patience!
                      </p>
                    </div>
                  ),
                  cancelButton: 'Close',
                });
              }}
            >
              <ExclamationCircleIconSolid className="h-3 w-3" />
              Notice a missing section?
            </button>
          </div>
        </motion.div>
      )}

      {!props.selected && (
        <button
          className="absolute -right-2 -top-2 z-20 hidden rounded-full bg-gray-200 p-1
                        text-xs text-gray-500 opacity-80 transition-all duration-150 hover:bg-indigo-100 hover:text-indigo-400
                        hover:opacity-100 group-hover:block dark:bg-gray-700 dark:text-white dark:hover:text-indigo-400"
          onClick={(e) => {
            e.stopPropagation();
            if (isBookmarked) {
              scheduleModification.removeScheduleBookmark(course);
            } else {
              scheduleModification.addScheduleBookmark(course);
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
            <BookmarkIconOutline className="h-5 w-5" />
          )}
        </button>
      )}
    </div>
  );
}

export default SearchScheduleClass;
