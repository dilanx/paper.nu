import { TrashIcon } from '@heroicons/react/24/outline';
import ScheduleManager from '../../ScheduleManager';
import { Alert } from '../../types/AlertTypes';
import { UserOptions } from '../../types/BaseTypes';
import {
  ScheduleBookmarks,
  ScheduleInteractions,
  ScheduleModificationFunctions,
  ScheduleSection,
} from '../../types/ScheduleTypes';
import { SearchModificationFunctions } from '../../types/SearchTypes';
import { SideCard } from '../../types/SideCardTypes';
import { openInfo } from '../../utility/ScheduleSectionInfo';
import Utility from '../../utility/Utility';

interface ScheduleClassProps {
  section: ScheduleSection;
  bookmarks: ScheduleBookmarks;
  alert?: Alert;
  sideCard?: SideCard;
  interactions?: ScheduleInteractions;
  sf: ScheduleModificationFunctions;
  ff: SearchModificationFunctions;
  switches: UserOptions;
  imageMode?: boolean;
  split?: { i: number; l: number };
}

function ScheduleClass(props: ScheduleClassProps) {
  const { section, interactions, sf, ff, switches, imageMode, split } = props;
  const { start_time, end_time, subject, number, title, instructors } = section;
  const color = ScheduleManager.getCourseColor(subject);

  const startDif = start_time!.m / 60;
  const length =
    end_time!.h * 60 + end_time!.m - (start_time!.h * 60 + start_time!.m);
  const endDif = length / 60;

  const instructorLastNames = instructors
    ?.map((i) => {
      if (i.name) {
        const nameParts = i.name.split(' ');
        let last = nameParts[nameParts.length - 1];
        if (last.endsWith('.')) {
          last = last.slice(0, -1);
        }
        if (
          (last.toLowerCase() === 'jr' || last.toLowerCase() === 'sr') &&
          nameParts.length > 2
        ) {
          last = nameParts[nameParts.length - 2];
        }
        return last;
      }
      return undefined;
    })
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
                bg-${color}-100 border-2 border-l-4 dark:bg-gray-800 border-${color}-400 group
                cursor-pointer overflow-visible transition duration-300 ease-in-out ${
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
      onClick={() => {
        if (!props.sideCard || !props.alert) return;
        openInfo(props.sideCard, props.alert, props.switches, section, {
          bookmarks: props.bookmarks,
          sf,
          ff,
        });
      }}
    >
      <div className="relative h-full w-full">
        <div
          className={`h-full w-full ${
            imageMode ? 'overflow-hidden' : 'no-scrollbar overflow-scroll'
          } p-2`}
        >
          <p
            className={`${
              imageMode ? 'text-md font-normal' : 'text-sm font-semibold'
            } m-0 p-0 text-black dark:text-white`}
          >
            {subject} {number}
            {section.component !== 'LEC' && (
              <>
                {' '}
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                  (
                  {Utility.convertSectionComponent(
                    section.component
                  ).toUpperCase()}
                  )
                </span>
              </>
            )}
          </p>
          <p className={`text-light m-0 text-xs text-black dark:text-white`}>
            {title}
          </p>
          <p className="m-0 text-xs font-light text-gray-500 opacity-75 dark:text-gray-300">
            {instructorLastNames}
          </p>
        </div>
        {switches.get.show_times && (
          <p
            className={`absolute bottom-1 right-1 m-0 text-right text-xs text-${color}-500 dark:text-${color}-300 font-semibold opacity-60 dark:opacity-90`}
          >
            {Utility.convertTime(start_time!) +
              ' - ' +
              Utility.convertTime(end_time!)}
          </p>
        )}
      </div>
      <button
        className={`absolute -top-2 -right-2 rounded-full p-0.5
                    ${
                      interactions?.hoverSection.get === section.section_id &&
                      interactions?.hoverDelete.get
                        ? 'block bg-red-100 text-red-400 opacity-100 dark:bg-gray-700'
                        : 'hidden bg-gray-200 text-gray-500 opacity-80 dark:text-white'
                    }
                    z-20 text-xs transition-all
                    duration-150 hover:bg-red-100 hover:text-red-400
                    hover:opacity-100 group-hover:block dark:bg-gray-700 dark:hover:text-red-400`}
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
        <TrashIcon className="h-5 w-5" />
      </button>
    </div>
  );
}

export default ScheduleClass;
