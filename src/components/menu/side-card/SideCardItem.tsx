import { Color } from '../../../types/BaseTypes';
import { SideCardItemData } from '../../../types/SideCardTypes';

interface SideCardItemProps {
  data: SideCardItemData;
  color: Color;
}

function SideCardItem({ data, color }: SideCardItemProps) {
  return (
    <div className="my-4 rounded-lg bg-gray-50 p-2 shadow-sm dark:bg-gray-800">
      <div className={`flex items-center gap-1 text-sm text-${color}-500 mb-2`}>
        {data.icon && <data.icon className="h-5 w-5" />}
        <p className="tracking-wider">{data.key}</p>
      </div>
      <div className="text-center font-medium text-gray-800 dark:text-gray-100">
        {data.value}
      </div>
    </div>
  );
}

export default SideCardItem;
