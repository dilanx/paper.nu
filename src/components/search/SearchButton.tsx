import { Color } from '../../types/BaseTypes';
import Tooltip from '../generic/Tooltip';

interface SearchButtonProps {
  action: () => void;
  icon?: React.ReactNode;
  children: React.ReactNode;
  color?: Color;
  tooltip?: string;
  ring?: boolean;
  fullWidth?: boolean;
}

function SearchButton({
  action,
  icon,
  children,
  color = 'gray',
  tooltip,
  ring,
  fullWidth,
}: SearchButtonProps) {
  return (
    <button
      className={`bg-${color}-200 dark:bg-gray-700 text-${color}-700 dark:text-${color}-300
                flex items-center justify-center gap-1 rounded-lg p-1 text-sm font-medium shadow-sm
                hover:opacity-100 active:bg-${color}-300 active:text-${color}-800 active:opacity-100
                dark:active:bg-gray-600 dark:active:text-${color}-200 group relative opacity-80
                ${fullWidth ? 'flex-grow' : 'px-4'}
                ${ring ? 'ring-2 ring-violet-600 dark:ring-violet-400' : ''}`}
      onClick={() => action()}
    >
      {icon}
      {children}
      {tooltip && (
        <Tooltip color="gray" className="-bottom-10 left-1/2 -translate-x-1/2">
          {tooltip}
        </Tooltip>
      )}
    </button>
  );
}

export default SearchButton;
