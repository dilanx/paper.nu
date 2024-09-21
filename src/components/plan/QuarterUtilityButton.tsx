import { IconElement } from '@/types/BaseTypes';

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
      className="flex items-center gap-0.5 rounded-md px-1 py-0.5 text-2xs font-medium text-gray-400 hover:bg-gray-300/25 active:bg-gray-300/50 dark:text-gray-400 dark:hover:bg-gray-500/25 dark:active:bg-gray-500/50"
      onClick={() => {
        if (onClick) {
          onClick();
        }
      }}
    >
      <Icon className="h-3 w-3 stroke-2" />
      <p>{children}</p>
    </button>
  );
}
