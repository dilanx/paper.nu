import { Color } from '../../types/BaseTypes';

interface TooltipProps {
  children: React.ReactNode;
  color: Color;
  className: string;
}

function Tooltip({ children, color, className }: TooltipProps) {
  return (
    <div
      className={`absolute hidden whitespace-nowrap rounded-md border-2 p-1 shadow-lg group-hover:block
            bg-${color}-50 dark:bg-gray-800 border-${color}-500 text-${color}-500 dark:text-${color}-300 text-sm font-medium ${className} z-10`}
    >
      {children}
    </div>
  );
}

export default Tooltip;
