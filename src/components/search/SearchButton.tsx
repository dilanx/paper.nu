import { Color } from '../../types/BaseTypes';
import Tooltip from '../generic/Tooltip';

interface SearchButtonProps {
  action: () => void;
  children: React.ReactNode;
  active?: Color;
  tooltip?: string;
}

function SearchButton({
  action,
  children,
  active,
  tooltip,
}: SearchButtonProps) {
  const color = active ?? 'gray';
  return (
    <button
      className={`bg-${color}-200 dark:bg-gray-600 text-${color}-700 dark:text-${color}-300
                font-medium p-1 rounded-lg opacity-60
                hover:opacity-100 active:bg-${color}-300 active:text-${color}-800 active:opacity-100
                dark:active:bg-gray-500 dark:active:text-${color}-200
                ${tooltip ? 'px-4 relative group' : 'flex-grow'}`}
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
