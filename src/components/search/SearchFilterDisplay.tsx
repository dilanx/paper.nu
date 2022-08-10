import { XIcon } from '@heroicons/react/outline';
import {
  FilterBadgeName,
  FilterDisplay,
  FilterDisplayMap,
  FilterOptions,
  SearchFilter,
} from '../../types/SearchTypes';
import { DayMap } from '../../utility/Constants';
import Utility from '../../utility/Utility';

const display = (
  value: string,
  ...relatedKeys: (keyof FilterOptions)[]
): FilterDisplay => ({ value, relatedKeys });

function filtersAsStrings({
  subject,
  startAfter,
  startBefore,
  endAfter,
  endBefore,
  meetingDays,
}: FilterOptions): FilterDisplayMap {
  const filters: FilterDisplayMap = {};

  if (subject) {
    filters['subject'] = display(subject, 'subject');
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

  if (meetingDays) {
    filters['meeting days'] = display(
      meetingDays.sort((a, b) => DayMap[a] - DayMap[b]).join(''),
      'meetingDays'
    );
  }

  return filters;
}

interface SearchFilterBadgeProps {
  name: FilterBadgeName;
  value: string;
  remove: () => void;
}

function SearchFilterBadge({ name, value, remove }: SearchFilterBadgeProps) {
  const color = Utility.getFilterBadgeColor(name);
  return (
    <button
      className="flex text-xs rounded-lg overflow-hidden group relative shadow-sm"
      onClick={() => remove()}
    >
      <p className={`px-1 py-0.5 bg-${color}-500 text-white`}>{name}</p>
      <p
        className={`px-1 py-0.5 bg-${color}-100 dark:bg-gray-600 text-${color}-500 dark:text-${color}-300 font-bold`}
      >
        {value}
      </p>
      <p
        className={`absolute top-0 left-0 w-full h-full text-white bg-${color}-400
                    rounded-lg hidden group-hover:flex justify-center items-center bg-opacity-80 group-active:bg-opacity-100`}
      >
        <XIcon className="w-4 h-4" />
      </p>
    </button>
  );
}

interface SearchFilterDisplayProps {
  filter: SearchFilter;
}

function SearchFilterDisplay({ filter }: SearchFilterDisplayProps) {
  const filterDisplay = filtersAsStrings(filter.get);
  const badges = Object.keys(filterDisplay).map((f) => {
    const name = f as FilterBadgeName;
    const d = filterDisplay[name]!;
    const toRemove: Partial<FilterOptions> = {};
    for (const key of d.relatedKeys) {
      toRemove[key] = undefined;
    }

    return (
      <SearchFilterBadge
        name={name}
        value={d.value}
        remove={() => filter.set(toRemove)}
        key={`filter-badge-${f}`}
      />
    );
  });
  return <div className="flex flex-wrap gap-2 justify-center">{badges}</div>;
}

export default SearchFilterDisplay;
