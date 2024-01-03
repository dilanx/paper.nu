import { XMarkIcon } from '@heroicons/react/24/outline';
import { Color } from '../../types/BaseTypes';
import {
  FilterBadgeName,
  FilterDisplay,
  FilterDisplayMap,
  FilterOptions,
  SearchFilter,
} from '../../types/SearchTypes';
import {
  ComponentMap,
  DayMap,
  DisciplineMap,
  DistroMap,
  Mode,
} from '../../utility/Constants';
import Utility from '../../utility/Utility';

const display = (
  value: string,
  ...relatedKeys: (keyof FilterOptions)[]
): FilterDisplay => ({ value, relatedKeys });

function filtersAsStrings({
  subject,
  meetingDays,
  startAfter,
  startBefore,
  endAfter,
  endBefore,
  allAvailability,
  components,
  instructor,
  location,
  distros,
  disciplines,
  unitGeq,
  unitLeq,
  include,
}: FilterOptions): FilterDisplayMap {
  const filters: FilterDisplayMap = {};

  if (subject) {
    filters['subject'] = display(subject, 'subject');
  }

  if (meetingDays) {
    filters['meeting days'] = display(
      meetingDays.sort((a, b) => DayMap[a] - DayMap[b]).join(''),
      'meetingDays'
    );
  }

  if (startAfter || startBefore) {
    const after = startAfter
      ? Utility.convertTime(startAfter, true)
      : '12:00 AM';
    const before = startBefore
      ? Utility.convertTime(startBefore, true)
      : '11:59 PM';
    filters['start'] = display(
      `${after} - ${before}`,
      'startAfter',
      'startBefore'
    );
  }

  if (endAfter || endBefore) {
    const after = endAfter ? Utility.convertTime(endAfter, true) : '12:00 AM';
    const before = endBefore
      ? Utility.convertTime(endBefore, true)
      : '11:59 PM';
    filters['end'] = display(`${after} - ${before}`, 'endAfter', 'endBefore');
  }

  if (allAvailability) {
    filters['time slots'] = display('all available', 'allAvailability');
  }

  if (components) {
    filters['components'] = display(
      components.sort((a, b) => ComponentMap[a] - ComponentMap[b]).join(', '),
      'components'
    );
  }

  if (instructor) {
    filters['instructor'] = display(instructor, 'instructor');
  }

  if (location) {
    filters['location'] = display(location, 'location');
  }

  if (distros) {
    filters['distros'] = display(
      distros.sort((a, b) => DistroMap[a] - DistroMap[b]).join(', '),
      'distros'
    );
  }

  if (disciplines) {
    filters['fd'] = display(
      disciplines
        .sort((a, b) => DisciplineMap[a] - DisciplineMap[b])
        .join(', '),
      'disciplines'
    );
  }

  if (unitGeq || unitLeq) {
    const geq = unitGeq ? unitGeq : 0;
    const leq = unitLeq ? unitLeq : 99;
    filters['units'] = display(`${geq} - ${leq}`, 'unitGeq', 'unitLeq');
  }

  if (include) {
    filters['include'] = display(include.join(', '), 'include');
  }

  return filters;
}

interface SearchFilterBadgeProps {
  name: FilterBadgeName;
  value: string;
  remove: () => void;
  color: Color;
}

function SearchFilterBadge({
  name,
  value,
  remove,
  color,
}: SearchFilterBadgeProps) {
  return (
    <button
      className="group relative flex overflow-hidden rounded-lg text-xs shadow-sm"
      onClick={() => remove()}
    >
      <p className={`px-1 py-0.5 bg-${color}-500 text-white`}>{name}</p>
      <p
        className={`px-1 py-0.5 bg-${color}-100 dark:bg-gray-600 text-${color}-500 dark:text-${color}-300
          overflow-hidden text-ellipsis whitespace-nowrap font-bold`}
      >
        {value}
      </p>
      <p
        className={`absolute left-0 top-0 h-full w-full text-white bg-${color}-400
                    hidden items-center justify-center rounded-lg bg-opacity-80 group-hover:flex group-active:bg-opacity-100`}
      >
        <XMarkIcon className="h-4 w-4" />
      </p>
    </button>
  );
}

interface SearchFilterDisplayProps {
  filter: SearchFilter;
  appMode: Mode;
}

function SearchFilterDisplay({ filter, appMode }: SearchFilterDisplayProps) {
  const filterDisplay = filtersAsStrings(filter.get);
  const badges = Object.keys(filterDisplay).reduce<JSX.Element[]>(
    (total, f) => {
      const name = f as FilterBadgeName;
      const d = filterDisplay[name]!;
      const toRemove: Partial<FilterOptions> = {};
      for (const key of d.relatedKeys) {
        toRemove[key] = undefined;
      }

      const [color, mode] = Utility.getFilterBadgeInfo(name);

      if (
        mode === 'b' ||
        (mode === 'p' && appMode === Mode.PLAN) ||
        (mode === 's' && appMode === Mode.SCHEDULE)
      ) {
        total.push(
          <SearchFilterBadge
            name={name}
            value={d.value}
            remove={() => filter.set(toRemove)}
            color={color}
            key={`filter-badge-${f}`}
          />
        );
      }

      return total;
    },
    []
  );
  return <div className="flex flex-wrap justify-center gap-2">{badges}</div>;
}

export default SearchFilterDisplay;
