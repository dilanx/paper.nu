import { Color } from '../../types/BaseTypes';
import Tooltip from '../generic/Tooltip';

interface SearchButtonProps {
  action: () => void;
  children: React.ReactNode;
  active?: Color;
  tooltip?: string;
  ring?: boolean;
}

function SearchButton({
  action,
  children,
  active,
  tooltip,
  ring,
}: SearchButtonProps) {
  const color = active ?? 'gray';
  return (
    <button
      className={`bg-${color}-200 dark:bg-gray-600 text-${color}-700 dark:text-${color}-300
                rounded-lg p-1 font-medium
                hover:opacity-100 active:bg-${color}-300 active:text-${color}-800 active:opacity-100
                dark:active:bg-gray-500 dark:active:text-${color}-200
                ${tooltip ? 'group relative px-4' : 'flex-grow'}
                ${
                  ring
                    ? 'opacity-80 ring-2 ring-violet-600 dark:ring-violet-400'
                    : 'opacity-60'
                }`}
      onClick={() => action()}
    >
      {children}
      {tooltip && (
        <Tooltip color={color} className="-bottom-10 right-0">
          {tooltip}
        </Tooltip>
      )}
    </button>
  );
}

export default SearchButton;
