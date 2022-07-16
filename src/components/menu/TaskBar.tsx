import {
    BookmarkIcon,
    CloudIcon,
    CogIcon,
    ExternalLinkIcon,
    InformationCircleIcon,
    SearchIcon,
} from '@heroicons/react/outline';
import React from 'react';
import Account from '../../Account';
import { Alert } from '../../types/AlertTypes';
import { Color, ColorMap, UserOptions } from '../../types/BaseTypes';
import { PlanSpecialFunctions } from '../../types/PlanTypes';
import aboutMenu from './About';
import settingsMenu from './Settings';
import shareMenu from './Share';
import { TabBar, TabBarButton } from './TabBar';

interface MiniButtonProps {
    icon: (props: React.ComponentProps<'svg'>) => JSX.Element;
    color: Color;
    display: string;
    action: () => void;
}

function MiniButton(props: MiniButtonProps) {
    let color = props.color;
    return (
        <button
            className={`p-1 border-2 border-gray-400 dark:border-gray-500 rounded-lg text-gray-500 dark:text-gray-300
                hover:border-${color}-500 dark:hover:border-${color}-500 hover:bg-${color}-50 dark:hover:bg-gray-800
                hover:text-${color}-500 dark:hover:text-${color}-400 transition-all duration-150 relative group`}
            onClick={() => {
                props.action();
            }}
        >
            <props.icon className="w-5 h-5" />
            <div
                className={`hidden group-hover:block absolute -top-10 left-1/2 -translate-x-1/2 p-1 border-2 rounded-md
                    bg-${color}-50 dark:bg-gray-800 border-${color}-500 text-${color}-500 dark:text-${color}-300 text-sm font-medium`}
            >
                {props.display}
            </div>
        </button>
    );
}

const TabBarButtonColors: ColorMap = {
    Search: 'gray',
    'My List': 'indigo',
    Plans: 'rose',
};

interface TaskBarProps {
    alert: Alert;
    version: string;
    switches: UserOptions;
    f2: PlanSpecialFunctions;
    tabLoading: boolean;
}

function TaskBar(props: TaskBarProps) {
    return (
        <div className="flex mx-auto mt-2 mb-4 gap-2">
            <MiniButton
                icon={InformationCircleIcon}
                color="purple"
                display="About"
                action={() => props.alert(aboutMenu(props.version))}
            />
            <MiniButton
                icon={ExternalLinkIcon}
                color="green"
                display="Share"
                action={() => props.alert(shareMenu())}
            />
            <MiniButton
                icon={CogIcon}
                color="yellow"
                display="Settings"
                action={() => props.alert(settingsMenu(props.f2))}
            />
            <TabBar
                switches={props.switches}
                switchName="tab"
                tabLoading={props.tabLoading}
                colorMap={TabBarButtonColors}
            >
                <TabBarButton
                    name="Search"
                    selected={props.switches.get.tab as string}
                    switches={props.switches}
                    switchName="tab"
                    color={TabBarButtonColors['Search']}
                >
                    <SearchIcon className="w-5 h-5" />
                </TabBarButton>
                <TabBarButton
                    name="My List"
                    selected={props.switches.get.tab as string}
                    switches={props.switches}
                    switchName="tab"
                    color={TabBarButtonColors['My List']}
                >
                    <BookmarkIcon className="w-5 h-5" />
                </TabBarButton>
                <TabBarButton
                    name="Plans"
                    selected={props.switches.get.tab as string}
                    switches={props.switches}
                    switchName="tab"
                    color={TabBarButtonColors['Plans']}
                >
                    <CloudIcon className="w-5 h-5" />
                    <p className="lg:hidden xl:block m-0 text-sm lg:text-xs w-20 lg:w-12 overflow-hidden whitespace-nowrap text-ellipsis">
                        {Account.getPlanName(
                            props.switches.get.active_plan_id as string
                        )}
                    </p>
                </TabBarButton>
            </TabBar>
        </div>
    );
}

export default TaskBar;
