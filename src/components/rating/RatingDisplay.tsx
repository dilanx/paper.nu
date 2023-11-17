import { IconElement } from '../../types/BaseTypes';
import { BarChartMode, BarChartValue } from '../../types/GenericMenuTypes';
import BarChart from '../generic/BarChart';

interface RatingDisplayProps {
  mode?: BarChartMode;
  title: string;
  Icon: IconElement;
  chartId: string;
  description?: string;
  values: BarChartValue[];
  labelClassName?: string;
}

export default function RatingDisplay({
  mode,
  title,
  Icon,
  chartId,
  description,
  values,
  labelClassName,
}: RatingDisplayProps) {
  const isHorizontal = mode === 'horizontal';

  return (
    <div
      className={`flex flex-col gap-4 text-center text-black dark:text-white ${
        isHorizontal ? '' : 'lg:flex-row lg:text-right'
      }`}
    >
      <div
        className={`flex flex-col items-center justify-center ${
          isHorizontal ? '' : 'flex-[40%] lg:items-end'
        }`}
      >
        <div className="flex items-center gap-1">
          <Icon className="h-6 w-6" />
          <p className="text-2xl font-bold tracking-wide">{title}</p>
        </div>
        {description && <p className="text-xs">{description}</p>}
      </div>
      <div className={isHorizontal ? 'my-2' : 'flex-[60%]'}>
        <BarChart
          mode={mode}
          id={chartId}
          values={values}
          labelClassName={labelClassName}
        />
      </div>
    </div>
  );
}
