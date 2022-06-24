import { ReactNode } from 'react';
import { RefreshIcon } from '@heroicons/react/outline';
import { Color, ColorMap, UserOptions } from '../../types/BaseTypes';

interface TabBarProps {
    switches: UserOptions;
    switchName: string;
    tabLoading: boolean;
    colorMap: ColorMap;
    children?: ReactNode;
}

interface TabBarButtonProps {
    name: string;
    selected: string;
    switches: UserOptions;
    switchName: string;
    color: Color;
    disableClick?: boolean;
    tooltipBelow?: boolean;
    children?: ReactNode;
}

export function TabBar(props: TabBarProps) {
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
                        switchName="Tab"
                        color={color}
                        disableClick={true}
                    >
                        <RefreshIcon className="w-5 h-5 animate-reverse-spin" />
                        <p className="lg:hidden xl:block m-0 text-sm lg:text-xs w-20 lg:w-12 overflow-hidden whitespace-nowrap text-ellipsis">
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
                    : `bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-300
                    hover:bg-${color}-100 hover:text-${color}-600 dark:hover:text-${color}-400
                    transition-all duration-150 ${
                        props.name === 'Loading' ? 'cursor-not-allowed' : ''
                    }`
            } flex items-center gap-1 group`}
            onClick={() => {
                if (props.disableClick) return;
                props.switches.set(props.switchName, props.name, false);
            }}
        >
            {props.children}
            <div
                className={`hidden group-hover:block absolute ${
                    props.tooltipBelow ? '-bottom-10' : '-top-10'
                } left-1/2 -translate-x-1/2 p-1 border-2 rounded-md
                    bg-${color}-50 dark:bg-gray-800 border-${color}-500 text-${color}-500 dark:text-${color}-300 text-sm font-medium`}
            >
                {props.name}
            </div>
        </button>
    );
}
