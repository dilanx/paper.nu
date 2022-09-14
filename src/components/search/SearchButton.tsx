import { Color } from '../../types/BaseTypes';

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
                font-medium p-1 rounded-lg opacity-60 transition-all duration-150
                hover:opacity-100 active:bg-${color}-300 active:text-${color}-800 active:opacity-100
                dark:active:bg-gray-500 dark:active:text-${color}-200
                ${tooltip ? 'px-2 relative group' : 'flex-grow'}`}
      onClick={() => action()}
    >
      {children}
      {tooltip && (
        <div
          className={`hidden group-hover:block absolute -top-10 left-1/2 -translate-x-1/2 p-1 border-2 rounded-md
                    bg-${color}-50 dark:bg-gray-800 border-${color}-500 text-${color}-500 dark:text-${color}-300 text-sm font-medium`}
        >
          {tooltip}
        </div>
      )}
    </button>
  );
}

export default SearchButton;
