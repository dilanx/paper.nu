import {
  BookmarkIcon,
  DocumentIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkIconSolid } from '@heroicons/react/24/solid';
import PlanManager from '../../PlanManager';
import ScheduleManager from '../../ScheduleManager';
import {
  Alert,
  AlertDataEditButton,
  AlertDataExtra,
  NontoggleableAlertDataEditButton,
  ToggleableAlertDataEditButton,
} from '../../types/AlertTypes';
import { UserOptions } from '../../types/BaseTypes';
import {
  ScheduleBookmarks,
  ScheduleCourse,
  ScheduleInteractions,
  ScheduleModificationFunctions,
  ScheduleSection,
} from '../../types/ScheduleTypes';
import Utility from '../../utility/Utility';

interface ScheduleClassProps {
  section: ScheduleSection;
  bookmarks: ScheduleBookmarks;
  alert: Alert;
  interactions?: ScheduleInteractions;
  sf: ScheduleModificationFunctions;
  switches: UserOptions;
  imageMode?: boolean;
  split?: { i: number; l: number };
}

function openInfo(props: ScheduleClassProps) {
  const section = props.section;
  const name = section.subject + ' ' + section.number;
  const course = PlanManager.getCourse(name);
  const scheduleCourse = ScheduleManager.getCourseById(
    section.section_id.split('-')[0]
  );
  const color = PlanManager.getCourseColor(name);

  const extras: AlertDataExtra[] = [];

  extras.push({
    title: 'COMPONENT',
    content: Utility.capitalizeFirstLetter(
      Utility.convertSectionComponent(section.component)
    ),
  });
  extras.push({
    title: 'TIME SLOT',
    content: `${
      section.meeting_days && section.start_time && section.end_time
        ? `${Utility.convertAllDaysToString(
            section.meeting_days
          )} ${Utility.convertTime(
            section.start_time,
            true
          )} - ${Utility.convertTime(section.end_time, true)}`
        : 'No meeting times provided'
    }`,
  });
  extras.push({
    title: 'INSTRUCTOR' + ((section.instructors?.length || 0) > 1 ? 'S' : ''),
    content: section.instructors?.join(', ') || 'No instructor provided',
  });
  extras.push({
    title: 'LOCATION',
    content: section.room?.building_name || 'No location provided',
  });

  if (course) {
    if (course.prereqs) {
      extras.push({
        title: 'PREREQUISITES',
        content: course.prereqs,
      });
    }

    if (course.distros) {
      let distros = Utility.convertDistros(course.distros);
      extras.push({
        title: 'DISTRIBUTION AREAS',
        content: distros.join(', '),
      });
    }
  }

  const editButtons: AlertDataEditButton[] = [];

  if (scheduleCourse) {
    const bookmarkToggle: ToggleableAlertDataEditButton<ScheduleCourse> = {
      toggle: true,
      data: props.bookmarks,
      key: scheduleCourse,
      indexProperty: 'course_id',
      enabled: {
        title: 'Remove from My List',
        icon: <BookmarkIconSolid className="w-6 h-6" />,
        color: 'indigo',
        action: () => {
          props.sf.removeScheduleBookmark(scheduleCourse);
        },
      },
      disabled: {
        title: 'Add to My List',
        icon: <BookmarkIcon className="w-6 h-6" />,
        color: 'indigo',
        action: () => {
          props.sf.addScheduleBookmark(scheduleCourse);
        },
      },
    };
    editButtons.push(bookmarkToggle);
  }

  const remove: NontoggleableAlertDataEditButton = {
    toggle: false,
    buttonData: {
      title: 'Remove course',
      icon: <TrashIcon className="w-6 h-6" />,
      color: 'red',
      action: () => {
        props.sf.removeSection(section);
      },
      close: true,
    },
  };
  editButtons.push(remove);

  props.alert({
    title: name,
    subtitle: section.title,
    message: course?.description ?? 'No course description found',
    cancelButton: 'Close',
    iconColor: color,
    icon: DocumentIcon,
    extras: extras,
    editButtons: editButtons,
  });
}

function ScheduleClass(props: ScheduleClassProps) {
  const { section, interactions, sf, switches, imageMode, split } = props;
  const { start_time, end_time, subject, number, title, instructors } = section;
  const color = ScheduleManager.getCourseColor(subject);

  const startDif = start_time!.m / 60;
  const length =
    end_time!.h * 60 + end_time!.m - (start_time!.h * 60 + start_time!.m);
  const endDif = length / 60;

  const instructorLastNames = instructors
    ?.map((i) => i.split(' ').pop())
    .join(', ');

  let left = '0%';
  let width = '100%';
  if (split) {
    const { i, l } = split;
    left = `${(i / l) * 100}%`;
    width = `${100 / l}%`;
  }

  return (
    <div
      className={`absolute z-10 rounded-lg bg-opacity-60
                bg-${color}-100 dark:bg-gray-800 border-2 border-l-4 border-${color}-400 overflow-visible
                cursor-pointer transition ease-in-out duration-300 group ${
                  interactions?.hoverSection.get === section.section_id
                    ? '-translate-y-2 shadow-lg'
                    : ''
                } ${section.preview ? 'opacity-60' : ''}`}
      style={{
        top: `${startDif * 100}%`,
        left,
        width,
        height: `calc(${endDif * 100}% + ${
          2 * (end_time!.h - start_time!.h)
        }px)`,
      }}
      onMouseEnter={() => {
        interactions?.hoverSection.set(section.section_id);
      }}
      onMouseLeave={() => {
        interactions?.multiClear(['hoverSection', 'hoverDelete']);
      }}
      onClick={() => openInfo(props)}
    >
      <div className="w-full h-full relative">
        <div
          className={`w-full h-full ${
            imageMode ? 'overflow-hidden' : 'overflow-scroll no-scrollbar'
          } p-2`}
        >
          <p
            className={`${
              imageMode ? 'text-lg font-normal' : 'text-sm font-semibold'
            } m-0 p-0 text-black dark:text-white`}
          >
            {subject} {number}
            {section.component !== 'LEC' && (
              <>
                {' '}
                <span className="font-medium text-xs text-gray-600 dark:text-gray-400">
                  (
                  {Utility.convertSectionComponent(
                    section.component
                  ).toUpperCase()}
                  )
                </span>
              </>
            )}
          </p>
          <p className={`text-xs m-0 text-black dark:text-white text-light`}>
            {title}
          </p>
          <p className="m-0 text-xs text-gray-500 dark:text-gray-300 opacity-75 font-light">
            {instructorLastNames}
          </p>
        </div>
        {switches.get.show_times && (
          <p
            className={`m-0 text-right text-xs absolute bottom-1 right-1 text-${color}-500 dark:text-${color}-300 opacity-60 dark:opacity-90 font-semibold`}
          >
            {Utility.convertTime(start_time!) +
              ' - ' +
              Utility.convertTime(end_time!)}
          </p>
        )}
      </div>
      <button
        className={`absolute -top-2 -right-2 p-0.5 rounded-full
                    ${
                      interactions?.hoverSection.get === section.section_id &&
                      interactions?.hoverDelete.get
                        ? 'block text-red-400 bg-red-100 dark:bg-gray-700 opacity-100'
                        : 'hidden bg-gray-200 opacity-80 text-gray-500 dark:text-white'
                    }
                    hover:bg-red-100 dark:bg-gray-700 text-xs
                    hover:text-red-400 dark:hover:text-red-400 hover:opacity-100
                    transition-all duration-150 group-hover:block z-20`}
        onMouseEnter={() => {
          if (interactions?.hoverSection.get === section.section_id) {
            interactions?.hoverDelete.set(true);
          }
        }}
        onMouseLeave={() => {
          interactions?.hoverDelete.clear();
        }}
        onClick={(e) => {
          e.stopPropagation();
          sf.removeSection(section);
          interactions?.multiClear(['hoverSection', 'hoverDelete']);
        }}
      >
        <TrashIcon className="w-5 h-5" />
      </button>
    </div>
  );
}

export default ScheduleClass;
