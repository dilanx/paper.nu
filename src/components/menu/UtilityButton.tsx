import { IconElement } from '../../types/BaseTypes';

interface UtilityButtonProps {
  Icon?: IconElement;
  onClick?: (x: number, y: number) => void;
  active?: boolean;
  disabled?: boolean;
  children?: React.ReactNode;
}

export default function UtilityButton({
  Icon,
  onClick,
  active,
  disabled,
  children,
}: UtilityButtonProps) {
  return (
    <button
      onClick={(e) => {
        if (onClick) {
          const { x, y, width, height } =
            e.currentTarget.getBoundingClientRect();
          onClick(x + width, y + height + 10);
        }
      }}
      disabled={disabled}
      className={`flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-gray-500 dark:text-gray-400 ${
        active
          ? 'bg-gray-200 dark:bg-gray-600'
          : 'hover:bg-gray-100 active:bg-gray-200  dark:hover:bg-gray-700 dark:active:bg-gray-600'
      }`}
    >
      {Icon && <Icon className="h-4 w-4 stroke-2" />}
      <p>{children}</p>
    </button>
  );
}
