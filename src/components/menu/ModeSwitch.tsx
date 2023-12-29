import { CalendarIcon, RectangleStackIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';
import { Color, IconElement, UserOptions } from '../../types/BaseTypes';
import { Mode } from '../../utility/Constants';

interface ModeSwitchButtonProps {
  icon: IconElement;
  text: string;
  color: Color;
  active: boolean;
  transition?: [string, string];
  onClick: () => void;
}

function ModeSwitchButton({
  color,
  text,
  active,
  transition,
  onClick,
  ...props
}: ModeSwitchButtonProps) {
  return (
    <button
      className={`relative rounded-md px-4 py-2 transition-[background-color] duration-150 ${
        active
          ? 'text-white dark:text-gray-800'
          : `text-${color}-600 hover:bg-${color}-200 hover:bg-opacity-50 active:bg-${color}-200 active:bg-opacity-100
            dark:text-${color}-300 dark:hover:bg-${color}-600 dark:hover:bg-opacity-25 dark:active:bg-${color}-600 dark:active:bg-opacity-50`
      }`}
      onClick={onClick}
    >
      <div className="flex items-center justify-center gap-1 transition-[color] duration-500">
        <props.icon className="z-10 h-5 min-h-[1.25rem] w-5 min-w-[1.25rem]" />
        <p className="z-10 text-sm font-medium">{text}</p>
      </div>
      {active && (
        <motion.div
          className={`absolute left-0 top-0 z-0 h-full w-full rounded-md shadow-md bg-${color}-600 dark:bg-${color}-400`}
          layoutId="mode-switch"
          animate={{
            backgroundColor: transition,
            transition: {
              duration: 0.5,
            },
          }}
        />
      )}
    </button>
  );
}

interface ModeSwitchProps {
  switches: UserOptions;
  changeMode: (mode: Mode) => void;
}

function ModeSwitch({ switches, changeMode }: ModeSwitchProps) {
  return (
    <div className="mx-2 my-1 grid grid-cols-2 items-center justify-center gap-2">
      <ModeSwitchButton
        icon={RectangleStackIcon}
        text="Plan"
        color="purple"
        active={switches.get.mode === Mode.PLAN}
        transition={
          switches.get.dark ? ['#4ade80', '#c084fc'] : ['#16a34a', '#9333ea']
        }
        onClick={() => changeMode(Mode.PLAN)}
      />
      <ModeSwitchButton
        icon={CalendarIcon}
        text="Schedule"
        color="green"
        active={switches.get.mode === Mode.SCHEDULE}
        transition={
          switches.get.dark ? ['#c084fc', '#4ade80'] : ['#9333ea', '#16a34a']
        }
        onClick={() => changeMode(Mode.SCHEDULE)}
      />
    </div>
  );
}

export default ModeSwitch;
