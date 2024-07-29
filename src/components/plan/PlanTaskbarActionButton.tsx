import { IconElement } from '@/types/BaseTypes';

interface PlanTaskbarActionButtonProps {
  Icon: IconElement;
  onClick?: () => void;
  children?: React.ReactNode;
}

export default function PlanTaskbarActionButton({
  Icon,
  onClick,
  children,
}: PlanTaskbarActionButtonProps) {
  return (
    <button
      className="flex items-center gap-2 rounded-lg bg-gray-200 px-3 py-2 text-xs font-medium uppercase text-gray-700 opacity-50 shadow-sm hover:opacity-75 active:opacity-100 dark:bg-gray-700 dark:text-gray-100"
      onClick={onClick}
    >
      <Icon className="h-4 w-4" />
      <span>{children}</span>
    </button>
  );
}
