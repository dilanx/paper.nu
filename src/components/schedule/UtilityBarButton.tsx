import { Color, IconElement } from '../../types/BaseTypes';

interface UtilityBarButtonProps {
  icon: IconElement;
  color: Color;
  display: string;
  action: () => void;
}

function UtilityBarButton(props: UtilityBarButtonProps) {
  const color = props.color;
  return (
    <button
      className={`hover:text-${color}-500 transition-all duration-150 relative group`}
      onClick={() => props.action()}
    >
      <props.icon className="w-6 h-6" />
      <div
        className={`hidden group-hover:block absolute z-20 left-10 top-1/2 -translate-y-1/2 p-1 border-2 rounded-md whitespace-nowrap
                    bg-${color}-50 dark:bg-gray-800 border-${color}-500 text-${color}-500 dark:text-${color}-300 text-sm font-medium`}
      >
        {props.display}
      </div>
    </button>
  );
}

export default UtilityBarButton;
