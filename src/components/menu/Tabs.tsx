import { useApp } from '@/app/Context';
import Tooltip from '@/components/generic/Tooltip';
import { Color, ColorMap, ReadUserOptions } from '@/types/BaseTypes';
import { ReactNode } from 'react';
import { SpinnerCircularFixed } from 'spinners-react';

interface TabBarProps {
  switchName: keyof ReadUserOptions;
  tabLoading?: boolean;
  colorMap: ColorMap;
  children?: ReactNode;
}

interface TabBarButtonProps {
  name: string;
  display?: string;
  selected: string;
  switchName?: keyof ReadUserOptions;
  color: Color;
  disableClick?: boolean;
  tooltipBelow?: boolean;
  children?: ReactNode;
  alwaysShowDisplay?: boolean;
}

export function Tabs(props: TabBarProps) {
  const { userOptions } = useApp();
  const darkMode = userOptions.get.dark;
  const colorMap = props.colorMap;
  const color = colorMap[userOptions.get[props.switchName] as string];
  return (
    <div className="relative">
      <div
        className={`flex border-2 border-${color}-400 dark:border-${color}-500 rounded-lg bg-${color}-400 dark:bg-${color}-500 overflow-hidden`}
      >
        {props.tabLoading ? (
          <TabButton
            name="Loading"
            selected="None"
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
          </TabButton>
        ) : (
          props.children
        )}
      </div>
    </div>
  );
}

export function TabButton(props: TabBarButtonProps) {
  const { userOptions } = useApp();
  const color = props.color;
  return (
    <button
      className={`flex-1 px-2 py-1 text-sm ${
        props.name === props.selected
          ? `bg-${color}-400 dark:bg-${color}-500 text-white`
          : `bg-white text-gray-500 dark:bg-gray-800 dark:text-gray-300
          hover:bg-${color}-50 hover:text-${color}-500
          active:bg-${color}-100 active:text-${color}-500
          dark:hover:text-${color}-400 dark:active:text-${color}-300
                    ${props.name === 'Loading' ? 'cursor-not-allowed' : ''}`
      } group flex flex-col items-center justify-center`}
      onClick={() => {
        if (props.disableClick) return;
        if (props.switchName) {
          userOptions.set(props.switchName, props.name, false);
        }
      }}
    >
      {props.children}
      {props.alwaysShowDisplay && (
        <p className="text-xs">{props.display ?? props.name}</p>
      )}
      {!props.alwaysShowDisplay && (
        <Tooltip
          color={color}
          className={`text-md left-1/2 -translate-x-1/2 ${
            props.tooltipBelow ? '-bottom-9' : '-top-9'
          }`}
        >
          {props.display ?? props.name}
        </Tooltip>
      )}
    </button>
  );
}
