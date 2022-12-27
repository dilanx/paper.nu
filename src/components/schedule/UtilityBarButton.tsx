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
      className={`hover:text-${color}-500 group relative`}
      onClick={() => props.action()}
    >
      <props.icon className="h-6 w-6" />
      <Tooltip color={color} className="left-10 top-1/2 z-20 -translate-y-1/2">
        {props.display}
      </Tooltip>
    </button>
  );
}

export default UtilityBarButton;
