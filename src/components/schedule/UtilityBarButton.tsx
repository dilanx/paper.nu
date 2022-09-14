import { Color, IconElement } from '../../types/BaseTypes';
import Tooltip from '../generic/Tooltip';

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
      <Tooltip color={color} className="z-20 left-10 top-1/2 -translate-y-1/2">
        {props.display}
      </Tooltip>
    </button>
  );
}

export default UtilityBarButton;
