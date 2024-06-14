import { Color } from '@/types/BaseTypes';

interface TooltipProps {
  children: React.ReactNode;
  mini?: boolean;
  color: Color;
  className: string;
  style?: React.CSSProperties;
}

function Tooltip({ children, mini, color, className, style }: TooltipProps) {
  return (
    <div
      style={style}
      className={`absolute hidden whitespace-nowrap rounded-md ${
        mini ? 'border p-0 px-1 font-normal' : 'border-2 p-1 font-medium'
      } shadow-lg group-hover:block
            bg-${color}-50 dark:bg-gray-800 border-${color}-500 text-${color}-500 dark:text-${color}-300 text-xs ${className} z-10`}
    >
      {children}
    </div>
  );
}

export default Tooltip;
