import { Color } from '../../../types/BaseTypes';
import { SideCardDataItem } from '../../../types/SideCardTypes';

interface SideCardItemProps {
  data: SideCardDataItem;
  color: Color;
}

function SideCardItem({ data, color }: SideCardItemProps) {
  return (
    <div className="my-4 p-2 bg-gray-50 rounded-lg shadow-sm">
      <div className={`flex items-center gap-1 text-sm text-${color}-500 mb-2`}>
        {data.icon && <data.icon className="w-5 h-5" />}
        <p className="tracking-wider">{data.key}</p>
      </div>
      <p className="text-center text-gray-800 font-medium">{data.value}</p>
    </div>
  );
}

export default SideCardItem;
