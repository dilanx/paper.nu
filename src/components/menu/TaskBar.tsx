import React from 'react';
import Utility from '../../utility/Utility';
import {
    ExternalLinkIcon,
    InformationCircleIcon,
    CogIcon,
    SearchIcon,
    BookmarkIcon,
    CollectionIcon,
    RefreshIcon,
} from '@heroicons/react/outline';
import { Color, UserOptions } from '../../types/BaseTypes';
import { Alert } from '../../types/AlertTypes';
import { PlanSpecialFunctions } from '../../types/PlanTypes';
import Account from '../../Account';
import debugModule from 'debug';
import toast from 'react-hot-toast';

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

const TabBarButtonColors: { [key: string]: Color } = {
    Search: 'gray',
    'My List': 'indigo',
    Plans: 'rose',
};

interface TaskBarButtonProps {
    name: string;
    selected: string;
    switches: UserOptions;
    color: Color;
    content: JSX.Element;
    disableClick?: boolean;
}

function TabBarButton(props: TaskBarButtonProps) {
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
                props.switches.set('tab', props.name, false);
            }}
        >
            {props.content}
            <div
                className={`hidden group-hover:block absolute -top-10 left-1/2 -translate-x-1/2 p-1 border-2 rounded-md
                    bg-${color}-50 dark:bg-gray-800 border-${color}-500 text-${color}-500 dark:text-${color}-300 text-sm font-medium`}
            >
                {props.name}
            </div>
        </button>
    );
}

interface TabBarProps {
    switches: UserOptions;
    tabLoading: boolean;
}

function TabBar(props: TabBarProps) {
    let color = TabBarButtonColors[props.switches.get.tab as string];
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
                        content={
                            <>
                                <RefreshIcon className="w-5 h-5 animate-reverse-spin" />
                                <p className="lg:hidden xl:block m-0 text-sm lg:text-xs w-20 lg:w-12 overflow-hidden whitespace-nowrap text-ellipsis">
                                    Loading
                                </p>
                            </>
                        }
                        disableClick={true}
                    />
                ) : (
                    <>
                        <TabBarButton
                            name="Search"
                            selected={props.switches.get.tab as string}
                            switches={props.switches}
                            color={TabBarButtonColors['Search']}
                            content={<SearchIcon className="w-5 h-5" />}
                        />
                        <TabBarButton
                            name="My List"
                            selected={props.switches.get.tab as string}
                            switches={props.switches}
                            color={TabBarButtonColors['My List']}
                            content={<BookmarkIcon className="w-5 h-5" />}
                        />
                        <TabBarButton
                            name="Plans"
                            selected={props.switches.get.tab as string}
                            switches={props.switches}
                            color={TabBarButtonColors['Plans']}
                            content={
                                <>
                                    <CollectionIcon className="w-5 h-5" />
                                    <p className="lg:hidden xl:block m-0 text-sm lg:text-xs w-20 lg:w-12 overflow-hidden whitespace-nowrap text-ellipsis">
                                        {Account.getPlanName(
                                            props.switches.get
                                                .active_plan_id as string
                                        )}
                                    </p>
                                </>
                            }
                        />
                    </>
                )}
            </div>
        </div>
    );
}

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
                action={() => {
                    props.alert({
                        title: 'Plan Northwestern',
                        customSubtitle: (
                            <p className="text-md font-light text-gray-500 dark:text-gray-400">
                                version {props.version} by{' '}
                                <a
                                    className="text-purple-500 dark:text-purple-300 opacity-100 hover:opacity-60 transition-all duration-150"
                                    href="https://dilanxd.com"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    Dilan N
                                </a>
                            </p>
                        ),
                        message:
                            'An easy and organized way to plan out your classes at Northwestern. Data is all saved in the URL, so save the link to your plan to access it later or share with friends.',
                        confirmButton: 'View on GitHub',
                        confirmButtonColor: 'purple',
                        cancelButton: 'Close',
                        iconBackgroundColor: 'purple',
                        icon: (
                            <InformationCircleIcon
                                className="h-6 w-6 text-purple-600"
                                aria-hidden="true"
                            />
                        ),
                        action: () => {
                            window.open(
                                'https://github.com/dilanx/plan-northwestern',
                                '_blank'
                            );
                        },
                        options: [
                            {
                                name: 'about_change_log',
                                title: `What's new?`,
                                description: `Check out what changes have been made in the latest update.`,
                                buttonTextOn: `View the change log`,
                                singleAction: () => {
                                    window.open(
                                        'https://github.com/dilanx/plan-northwestern/blob/main/CHANGELOG.md',
                                        '_blank'
                                    );
                                },
                            },
                            {
                                name: 'about_coming_soon',
                                title: 'Coming soon',
                                description: `Check out what's been requested and what I'm working on on the GitHub issues page. Check this out before you send feedback in case someone else has already requested it.`,
                                buttonTextOn: `See what's coming`,
                                singleAction: () => {
                                    window.open(
                                        'https://github.com/dilanx/plan-northwestern/issues?q=',
                                        '_blank'
                                    );
                                },
                            },
                            {
                                name: 'about_feedback',
                                title: 'Share your thoughts!',
                                description: `Find any bugs, notice any errors in course data, or have any suggestions? Let me know! I'm always interested in making the site better.`,
                                buttonTextOn: 'Leave feedback',
                                singleAction: () => {
                                    window.open(
                                        'https://github.com/dilanx/plan-northwestern/blob/main/FEEDBACK.md',
                                        '_blank'
                                    );
                                },
                            },
                        ],
                    });
                }}
            />
            <MiniButton
                icon={ExternalLinkIcon}
                color="green"
                display="Share"
                action={() => {
                    props.alert({
                        title: 'Ready to share!',
                        message:
                            'All of your plan data is stored in the URL. When you make changes to your plan, the URL is updated to reflect those changes. Save it somewhere, or share with a friend!',
                        confirmButton: 'Copy to clipboard',
                        confirmButtonColor: 'emerald',
                        cancelButton: 'Close',
                        iconBackgroundColor: 'emerald',
                        icon: (
                            <ExternalLinkIcon
                                className="h-6 w-6 text-emerald-600"
                                aria-hidden="true"
                            />
                        ),
                        textView: window.location.href,
                        action: () => {
                            navigator.clipboard.writeText(window.location.href);
                            toast.success('URL copied to clipboard');
                        },
                    });
                }}
            />
            <MiniButton
                icon={CogIcon}
                color="yellow"
                display="Settings"
                action={() => {
                    props.alert({
                        title: 'Settings',
                        message: `Customize your Plan Northwestern experience! These settings are saved in your browser and not in the URL.`,
                        confirmButton: 'Close',
                        confirmButtonColor: 'yellow',
                        iconBackgroundColor: 'yellow',
                        icon: (
                            <CogIcon
                                className="h-6 w-6 text-yellow-600"
                                aria-hidden="true"
                            />
                        ),
                        options: [
                            {
                                name: 'dark',
                                title: 'Dark mode',
                                description: `Become one with the night.`,
                                buttonTextOn: 'Enabled',
                                buttonTextOff: 'Disabled',
                                saveToStorage: true,
                                bonusAction: (newSwitch) => {
                                    let color = newSwitch
                                        ? Utility.BACKGROUND_DARK
                                        : Utility.BACKGROUND_LIGHT;
                                    document.body.style.backgroundColor = color;
                                    document
                                        .querySelector(
                                            'meta[name="theme-color"]'
                                        )
                                        ?.setAttribute('content', color);
                                },
                            },
                            {
                                name: 'compact',
                                title: 'Compact mode',
                                description: `It's a bit uglier I think, but you can view more on the screen at once without needing to scroll.`,
                                buttonTextOn: 'Enabled',
                                buttonTextOff: 'Disabled',
                                saveToStorage: true,
                            },
                            {
                                name: 'quarter_units',
                                title: 'Show units per quarter',
                                description:
                                    'Reveal the unit count per quarter.',
                                buttonTextOn: 'Enabled',
                                buttonTextOff: 'Disabled',
                                saveToStorage: true,
                            },
                            {
                                name: 'more_info',
                                title: 'Show more info on classes',
                                description: `See prerequisites and distribution areas on the class items without having to click on their info button. The info won't display if compact mode is enabled.`,
                                buttonTextOn: 'Enabled',
                                buttonTextOff: 'Disabled',
                                saveToStorage: true,
                            },
                            {
                                name: 'save_location_top',
                                title: 'Save button location',
                                description: `When editing a plan linked to your account that has unsaved changes, a save button appears at the bottom right of the window by default. You can move it to the top right if you'd prefer.`,
                                buttonTextOn: 'Top right',
                                buttonTextOff: 'Bottom right',
                                saveToStorage: true,
                            },
                            {
                                name: 'save_to_storage',
                                title: 'Remember most recent plan',
                                description: `If you visit this site without a full plan URL, your most recently modified plan will be loaded.`,
                                buttonTextOn: 'Enabled',
                                buttonTextOff: 'Disabled',
                                saveToStorage: true,
                            },
                            {
                                name: 'clear_plan',
                                title: 'Clear plan',
                                description: `Clear all of your current plan data, which includes everything for each year and everything in My List. Make sure to save the current URL somewhere if you don't want to lose it.`,
                                buttonTextOn: 'Clear',
                                requireConfirmation: true,
                                singleAction: () => {
                                    props.f2.clearData();
                                },
                            },
                            {
                                name: 'reduced_motion',
                                title: 'Reduced motion',
                                description: `With reduced motion enabled, all transform and layout animations across the site will be disabled.`,
                                buttonTextOn: 'Enabled',
                                buttonTextOff: 'Disabled',
                                saveToStorage: true,
                            },
                            {
                                name: 'debug',
                                title: 'Debug mode',
                                description: `Log messages will print into your browser's console (verbose log level is required).`,
                                buttonTextOn: 'Enabled',
                                buttonTextOff: 'Disabled',
                                saveToStorage: true,
                                bonusAction: (newSwitch) => {
                                    if (newSwitch) {
                                        debugModule.enable('*');
                                    } else {
                                        debugModule.disable();
                                    }
                                },
                            },
                        ],
                    });
                }}
            />
            <TabBar switches={props.switches} tabLoading={props.tabLoading} />
        </div>
    );
}

export default TaskBar;
