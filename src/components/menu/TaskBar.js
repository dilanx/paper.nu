import React from 'react';
import Utility from '../../Utility.js';
import {
    SaveIcon,
    PlusIcon,
    InformationCircleIcon,
    ExclamationIcon,
    CogIcon,
} from '@heroicons/react/outline';

function TaskBarButton(props) {
    return (
        <button
            className={`border-2 rounded-md border-gray-400 bg-gray-50 text-gray-600
                hover:border-${props.color}-500 hover:bg-${
                props.color
            }-50 hover:text-${props.color}-500
                dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400
                dark:hover:border-${props.color}-500 dark:hover:bg-${
                props.color
            }-800 dark:hover:text-${props.color}-100
                transition-all duration-150 ${
                    props.span ? `col-span-${props.span}` : ''
                }
                ${
                    props.active
                        ? `border-${props.color}-400 bg-${props.color}-50 text-${props.color}-400 dark:border-${props.color}-600 dark:bg-${props.color}-900 dark:text-${props.color}-200`
                        : ``
                }`}
            onClick={() => {
                props.action();
            }}
        >
            {props.name}
        </button>
    );
}

class TaskBar extends React.Component {
    render() {
        return (
            <div className="grid grid-cols-3 px-4 gap-4 text-xs">
                <TaskBarButton
                    name="About"
                    color="purple"
                    action={() => {
                        this.props.alert({
                            title: 'Plan Northwestern',
                            customSubtitle: (
                                <p className="text-md font-light text-gray-500 dark:text-gray-400">
                                    version {this.props.version} by{' '}
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

                <TaskBarButton
                    name="Save / Share"
                    color="emerald"
                    action={() => {
                        this.props.alert({
                            title: 'Ready to share!',
                            message:
                                'All of your plan data is stored in the URL. When you make changes to your plan, the URL is updated to reflect those changes. Save it somewhere, or share with a friend!',
                            confirmButton: 'Copy to clipboard',
                            confirmButtonColor: 'emerald',
                            cancelButton: 'Close',
                            iconBackgroundColor: 'emerald',
                            icon: (
                                <SaveIcon
                                    className="h-6 w-6 text-emerald-600"
                                    aria-hidden="true"
                                />
                            ),
                            textView: window.location.href,
                            action: () => {
                                navigator.clipboard.writeText(
                                    window.location.href
                                );
                            },
                        });
                    }}
                />

                <TaskBarButton
                    name="Add Year"
                    color="cyan"
                    action={() => {
                        if (this.props.allowAddYear) {
                            this.props.alert({
                                title: 'Add a year?',
                                message:
                                    'This will add another year to your plan. You can remove it by removing all classes from that year and refreshing the page.',
                                confirmButton: 'Add year',
                                confirmButtonColor: 'cyan',
                                cancelButton: 'Close',
                                iconBackgroundColor: 'cyan',
                                icon: (
                                    <PlusIcon
                                        className="h-6 w-6 text-cyan-600"
                                        aria-hidden="true"
                                    />
                                ),
                                action: () => {
                                    this.props.addYear();
                                },
                            });
                        } else {
                            this.props.alert({
                                title: `Can't add another year :(`,
                                message: `You can't add more than 10 years.`,
                                confirmButton: 'Close',
                                confirmButtonColor: 'cyan',
                                iconBackgroundColor: 'cyan',
                                icon: (
                                    <ExclamationIcon
                                        className="h-6 w-6 text-cyan-600"
                                        aria-hidden="true"
                                    />
                                ),
                            });
                        }
                    }}
                />

                <TaskBarButton
                    name="Settings"
                    color="yellow"
                    action={() => {
                        this.props.alert({
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
                            switches: this.props.switches,
                            setSwitch: this.props.setSwitch,
                            options: [
                                {
                                    name: 'dark',
                                    title: 'Dark mode',
                                    description: `Become one with the night.`,
                                    buttonTextOn: 'Enabled',
                                    buttonTextOff: 'Disabled',
                                    saveToStorage: true,
                                    bonusAction: newSwitch => {
                                        let color = newSwitch
                                            ? Utility.BACKGROUND_DARK
                                            : Utility.BACKGROUND_LIGHT;
                                        document.body.style.backgroundColor =
                                            color;
                                        document
                                            .querySelector(
                                                'meta[name="theme-color"]'
                                            )
                                            .setAttribute('content', color);
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
                                        this.props.clearData();
                                    },
                                },
                            ],
                        });
                    }}
                />

                <TaskBarButton
                    name="My List"
                    color="indigo"
                    active={this.props.switches.favorites}
                    span="2"
                    action={() => {
                        this.props.setSwitch(
                            'favorites',
                            !this.props.switches.favorites
                        );
                    }}
                />
            </div>
        );
    }
}

export default TaskBar;
