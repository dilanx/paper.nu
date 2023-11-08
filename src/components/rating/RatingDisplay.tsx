import { IconElement } from '../../types/BaseTypes';
import { BarChartValue } from '../../types/GenericMenuTypes';
import BarChart from '../generic/BarChart';

interface RatingDisplayProps {
  title: string;
  Icon: IconElement;
  chartId: string;
  description?: string;
  values: BarChartValue[];
  labelClassName?: string;
}

export default function RatingDisplay({
  title,
  Icon,
  chartId,
  description,
  values,
  labelClassName,
}: RatingDisplayProps) {
  return (
    <div className="flex flex-col gap-4 text-center text-black dark:text-white lg:flex-row lg:text-right">
      <div className="flex flex-[40%] flex-col items-center justify-center lg:items-end">
        <div className="flex items-center gap-1">
          <Icon className="h-6 w-6" />
          <p className="text-2xl font-bold tracking-wide">{title}</p>
        </div>
        {description && <p className="text-xs">{description}</p>}
      </div>
      <div className="flex-[60%]">
        <BarChart
          id={chartId}
          values={values}
          labelClassName={labelClassName}
        />
      </div>
    </div>
  );
}
