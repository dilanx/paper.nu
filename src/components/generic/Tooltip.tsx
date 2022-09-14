import { Color } from '../../types/BaseTypes';

interface TooltipProps {
  children: React.ReactNode;
  color: Color;
  className: string;
}

function Tooltip({ children, color, className }: TooltipProps) {
  return (
    <div
      className={`hidden group-hover:block absolute p-1 border-2 rounded-md whitespace-nowrap
            bg-${color}-50 dark:bg-gray-800 border-${color}-500 text-${color}-500 dark:text-${color}-300 text-sm font-medium ${className}`}
    >
      {children}
    </div>
  );
}

export default Tooltip;
