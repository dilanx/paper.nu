import { IconElement } from '../../types/BaseTypes';
import { BarChartMode, BarChartValue } from '../../types/GenericMenuTypes';
import { RatingCalculations } from '../../types/RatingTypes';
import BarChart from '../generic/BarChart';

interface RatingDisplayProps {
  mode?: BarChartMode;
  title: string;
  Icon: IconElement;
  chartId: string;
  description?: string;
  values: BarChartValue[];
  calculations: RatingCalculations;
  labelClassName?: string;
}

export default function RatingDisplay({
  mode,
  title,
  Icon,
  chartId,
  description,
  values,
  calculations,
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
        <div className="mt-2 flex gap-1 text-xs font-bold text-gray-400">
          <p>{calculations[0].toFixed(1)} AVERAGE</p>
          <div className="h-full w-[1px] rounded-sm bg-gray-300 dark:bg-gray-500" />
          <p>{calculations[1]} TOTAL</p>
        </div>
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
