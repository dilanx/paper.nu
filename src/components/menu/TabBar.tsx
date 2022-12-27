import { ReactNode } from 'react';
import { SpinnerCircularFixed } from 'spinners-react';
import {
  Color,
  ColorMap,
  ReadUserOptions,
  UserOptions,
} from '../../types/BaseTypes';
import Tooltip from '../generic/Tooltip';

interface TabBarProps {
  switches: UserOptions;
  switchName: keyof ReadUserOptions;
  tabLoading?: boolean;
  colorMap: ColorMap;
  children?: ReactNode;
}

interface TabBarButtonProps {
  name: string;
  display?: string;
  selected: string;
  switches: UserOptions;
  switchName?: keyof ReadUserOptions;
  color: Color;
  disableClick?: boolean;
  tooltipBelow?: boolean;
  children?: ReactNode;
}

export function TabBar(props: TabBarProps) {
  const darkMode = props.switches.get.dark;
  let colorMap = props.colorMap;
  let color = colorMap[props.switches.get[props.switchName] as string];
  return (
    <div className="relative">
      <div
        className={`flex border-2 border-${color}-400 dark:border-${color}-500 rounded-lg bg-${color}-400 dark:bg-${color}-500 overflow-hidden`}
      >
        {props.tabLoading ? (
          <TabBarButton
            name="Loading"
            selected="None"
            switches={props.switches}
            color={color}
            disableClick={true}
          >
            <SpinnerCircularFixed
              size={20}
              thickness={160}
              speed={200}
              color={darkMode ? 'rgb(212, 212, 212)' : 'rgb(115, 115, 115)'}
              secondaryColor={
                darkMode ? 'rgb(64, 64, 64)' : 'rgba(245, 245, 245)'
              }
            />
            <p className="m-0 w-20 overflow-hidden text-ellipsis whitespace-nowrap text-sm lg:hidden lg:w-12 lg:text-xs xl:block">
              Loading
            </p>
          </TabBarButton>
        ) : (
          props.children
        )}
      </div>
    </div>
  );
}

export function TabBarButton(props: TabBarButtonProps) {
  let color = props.color;
  return (
    <button
      className={`px-2 py-1 ${
        props.name === props.selected
          ? `bg-${color}-400 dark:bg-${color}-500 text-white`
          : `bg-white text-gray-500 dark:bg-gray-800 dark:text-gray-300
                    hover:bg-${color}-100 hover:text-${color}-600 dark:hover:text-${color}-400
                    ${props.name === 'Loading' ? 'cursor-not-allowed' : ''}`
      } group flex items-center gap-1`}
      onClick={() => {
        if (props.disableClick) return;
        if (props.switchName) {
          props.switches.set(props.switchName, props.name, false);
        }
      }}
    >
      {props.children}
      <Tooltip
        color={color}
        className={`left-1/2 -translate-x-1/2 ${
          props.tooltipBelow ? '-bottom-10' : '-top-10'
        }`}
      >
        {props.display ?? props.name}
      </Tooltip>
    </button>
  );
}
