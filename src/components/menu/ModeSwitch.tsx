import { CalendarIcon, RectangleStackIcon } from '@heroicons/react/24/solid';
import { Color, IconElement, UserOptions } from '../../types/BaseTypes';
import { Mode } from '../../utility/Constants';

interface ModeSwitchButtonProps {
  icon: IconElement;
  text: string;
  color: Color;
  active: boolean;
  onClick: () => void;
}

function ModeSwitchButton({
  color,
  text,
  active,
  onClick,
  ...props
}: ModeSwitchButtonProps) {
  return (
    <button
      className={`flex flex-1 items-center justify-center gap-1 rounded-md border-2 px-4 py-0.5 transition-all
        duration-150 border-${color}-600 dark:border-${color}-400 ${
        active
          ? `bg-${color}-600 text-white dark:bg-${color}-400 dark:text-gray-800`
          : `text-${color}-600 hover:bg-opacity-50 hover:bg-${color}-100 active:bg-opacity-100
            dark:text-${color}-300 dark:hover:bg-opacity-25 dark:hover:bg-${color}-600 dark:active:bg-opacity-50`
      }`}
      onClick={onClick}
    >
      <props.icon className="h-5 w-5" />
      <p className="text-sm font-medium">{text}</p>
    </button>
  );
}

interface ModeSwitchProps {
  switches: UserOptions;
  changeMode: (mode: Mode) => void;
}

function ModeSwitch({ switches, changeMode }: ModeSwitchProps) {
  return (
    <div className="my-1 mx-4 flex items-center justify-center gap-4">
      <ModeSwitchButton
        icon={RectangleStackIcon}
        text="Plan"
        color="purple"
        active={switches.get.mode === Mode.PLAN}
        onClick={() => changeMode(Mode.PLAN)}
      />
      <ModeSwitchButton
        icon={CalendarIcon}
        text="Schedule"
        color="green"
        active={switches.get.mode === Mode.SCHEDULE}
        onClick={() => changeMode(Mode.SCHEDULE)}
      />
    </div>
  );
}

export default ModeSwitch;
