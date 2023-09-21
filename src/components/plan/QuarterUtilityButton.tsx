import { IconElement } from '../../types/BaseTypes';

interface QuarterUtilityButtonProps {
  Icon: IconElement;
  onClick?: () => void;
  children?: React.ReactNode;
}

export default function QuarterUtilityButton({
  Icon,
  onClick,
  children,
}: QuarterUtilityButtonProps) {
  return (
    <button
      className="flex items-center gap-1 rounded-md px-1 py-0.5 text-xs text-gray-400 hover:bg-gray-200/50 active:bg-gray-300/50 dark:text-gray-500 dark:hover:bg-gray-600/50 dark:active:bg-gray-500/50"
      onClick={() => {
        if (onClick) {
          onClick();
        }
      }}
    >
      <Icon className="h-4 w-4 stroke-2" />
      <p>{children}</p>
    </button>
  );
}
