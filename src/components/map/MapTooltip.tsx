import { Tooltip } from 'react-leaflet';

interface MapTooltipProps {
  direction: 'right' | 'bottom';
  permanent?: boolean;
  children?: React.ReactNode;
}

export default function MapTooltip({
  direction,
  permanent,
  children,
}: MapTooltipProps) {
  return (
    <Tooltip
      direction={direction}
      permanent={permanent}
      offset={direction === 'bottom' ? [-16, 20] : [0, 0]}
      className={`border-none bg-white/50 text-black shadow-lg backdrop-blur-md dark:bg-gray-700/50 dark:text-white ${
        direction === 'right'
          ? 'before:border-r-white/50 dark:before:border-r-gray-700/50'
          : 'before:border-b-white/50 dark:before:border-b-gray-700/50'
      }`}
      opacity={1}
    >
      {children}
    </Tooltip>
  );
}
