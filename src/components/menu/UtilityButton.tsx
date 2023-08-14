import { IconElement } from '../../types/BaseTypes';

interface UtilityButtonProps {
  Icon?: IconElement;
  onClick?: () => void;
  disabled?: boolean;
  children?: React.ReactNode;
}

export default function UtilityButton({
  Icon,
  onClick,
  disabled,
  children,
}: UtilityButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-gray-500 hover:bg-gray-100 active:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:active:bg-gray-600"
    >
      <p>{children}</p>
      {Icon && <Icon className="h-4 w-4 stroke-2" />}
    </button>
  );
}
