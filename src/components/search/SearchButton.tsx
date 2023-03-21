import { Color } from '../../types/BaseTypes';
import Tooltip from '../generic/Tooltip';

interface SearchButtonProps {
  action: () => void;
  icon?: React.ReactNode;
  children: React.ReactNode;
  active?: Color;
  tooltip?: string;
  ring?: boolean;
}

function SearchButton({
  action,
  icon,
  children,
  active,
  tooltip,
  ring,
}: SearchButtonProps) {
  const color = active ?? 'gray';
  return (
    <button
      className={`bg-${color}-200 dark:bg-gray-600 text-${color}-700 dark:text-${color}-300
                flex items-center justify-center gap-1 rounded-lg p-1 text-sm font-medium
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
      {icon}
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
