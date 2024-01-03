import { IconElement } from '../../../types/BaseTypes';

interface ToolbarButtonProps {
  children: string;
  icon: IconElement;
  onClick?: (x: number, y: number) => void;
  active?: boolean;
  selected?: boolean;
}

function ToolbarButton({
  children,
  icon: Icon,
  onClick,
  active,
  selected,
}: ToolbarButtonProps) {
  return (
    <button
      onClick={(e) => {
        if (onClick) {
          const { x, y, width, height } =
            e.currentTarget.getBoundingClientRect();
          onClick(x + width, y + height + 10);
        }
      }}
      className={`z-30 flex items-center gap-1 whitespace-nowrap rounded-lg px-3 py-1 text-sm
      font-medium ${
        active
          ? 'bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-100'
          : `hover:bg-gray-100 active:bg-gray-200 
             dark:hover:bg-gray-700  dark:active:bg-gray-600 
            ${
              selected
                ? 'text-pink-500'
                : 'text-gray-600 hover:text-gray-800 active:text-gray-800 dark:text-gray-300 dark:hover:text-gray-50 dark:active:text-gray-50'
            }
            `
      }`}
    >
      <Icon className="h-5 w-5 stroke-2 md:h-4 md:w-4" />
      <p className="hidden md:block">{children}</p>
    </button>
  );
}

export default ToolbarButton;
