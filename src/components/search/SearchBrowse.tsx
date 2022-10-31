import ScheduleManager from '../../ScheduleManager';
import { Color } from '../../types/BaseTypes';
import { SearchFilter } from '../../types/SearchTypes';

interface BrowseButtonProps {
  symbol: string;
  name: string;
  action: () => void;
  color?: Color;
}

function BrowseButton({ symbol, name, action, color }: BrowseButtonProps) {
  const primary = color || 'gray';
  const secondary = color || 'green';
  return (
    <button
      className={`w-full border-4 border-${primary}-200 dark:border-${primary}-500 bg-${primary}-100 dark:bg-gray-800
                rounded-lg px-4 py-2 text-left hover:border-${secondary}-400 dark:hover:border-${secondary}-300
                active:bg-green-50 active:border-green-300 dark:active:border-green-200
                text-gray-600 dark:text-gray-200`}
      onClick={() => action()}
    >
      <p className="text-xl font-medium">{symbol}</p>
      <p className="text-sm font-light">{name}</p>
    </button>
  );
}

interface SearchBrowseProps {
  filter: SearchFilter;
  school?: string;
  setSchool: (school: string) => void;
}

function SearchBrowse({ filter, school, setSchool }: SearchBrowseProps) {
  return (
    <div className="m-4 flex flex-col gap-3">
      {!school &&
        ScheduleManager.getAllSchoolSymbols().map((s, i) => (
          <BrowseButton
            symbol={s}
            name={ScheduleManager.getSchoolName(s)}
            action={() => setSchool(s)}
            key={`browse-school-${i}`}
          />
        ))}
      {school && (
        <>
          <div className="text-center">
            <p className="text-2xl font-medium text-gray-400">{school}</p>
            <p className="text-sm text-gray-400">
              {ScheduleManager.getSchoolName(school)}
            </p>
          </div>
          {ScheduleManager.getSchoolSubjects(school).map((s, i) => (
            <BrowseButton
              symbol={s.symbol}
              name={s.name}
              action={() => {
                filter.set({ subject: s.symbol }, true);
              }}
              color={ScheduleManager.getCourseColor(s.symbol)}
              key={`browse-subject-${i}`}
            />
          ))}
        </>
      )}
    </div>
  );
}

export default SearchBrowse;
