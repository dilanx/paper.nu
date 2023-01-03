import { IconElement } from '../../../types/BaseTypes';

interface ToolbarButtonProps {
  children: string;
  icon: IconElement;
  onClick?: (x: number, y: number) => void;
  active?: boolean;
}

function ToolbarButton({
  children,
  icon: Icon,
  onClick,
  active,
}: ToolbarButtonProps) {
  return (
    <button
      onClick={(e) => {
        if (onClick) {
          const { x, y, width, height } =
            e.currentTarget.getBoundingClientRect();
          console.log(x, width);
          onClick(x + width, y + height + 10);
        }
      }}
      className={`z-30 flex items-center gap-1 whitespace-nowrap rounded-lg px-3 py-1
      font-medium ${
        active
          ? 'bg-green-100 text-gray-800 dark:bg-green-600 dark:text-gray-100'
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800 active:bg-green-100 active:text-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-50 dark:active:bg-green-600 dark:active:text-gray-50'
      }`}
    >
      <p className="hidden md:block">{children}</p>
      <Icon className="h-6 w-6 stroke-2 md:h-5 md:w-5" />
    </button>
  );
}

export default ToolbarButton;
