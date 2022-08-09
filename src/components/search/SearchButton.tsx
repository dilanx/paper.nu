import { Color } from '../../types/BaseTypes';

interface SearchButtonProps {
  action: () => void;
  children: React.ReactNode;
  active?: Color;
}

function SearchButton({ action, children, active }: SearchButtonProps) {
  const color = active ?? 'gray';
  return (
    <button
      className={`flex-1 bg-${color}-200 dark:bg-gray-600 text-${color}-700 dark:text-${color}-300
                font-medium p-1 rounded-lg opacity-60 transition-all duration-150
                hover:opacity-100 active:bg-${color}-300 active:text-${color}-800 active:opacity-100
                dark:active:bg-gray-500 dark:active:text-${color}-400`}
      onClick={() => action()}
    >
      {children}
    </button>
  );
}

export default SearchButton;
