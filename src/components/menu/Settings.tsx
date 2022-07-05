import {
    CogIcon,
    DotsHorizontalIcon,
    PencilIcon,
} from '@heroicons/react/outline';
import debugModule from 'debug';
import { AlertData } from '../../types/AlertTypes';
import { PlanSpecialFunctions } from '../../types/PlanTypes';
import Utility from '../../utility/Utility';

const settingsMenu = (f2: PlanSpecialFunctions): AlertData => ({
    title: 'Settings',
    message: `Customize your Plan Northwestern experience! These settings are saved in your browser and not in the URL.`,
    confirmButton: 'Close',
    confirmButtonColor: 'yellow',
    iconBackgroundColor: 'yellow',
    icon: <CogIcon className="h-6 w-6 text-yellow-600" aria-hidden="true" />,
    tabs: {
        switchName: 'settings_tab',
        colorMap: {
            Appearance: 'orange',
            Advanced: 'gray',
        },
        tabs: [
            {
                name: 'Appearance',
                display: <PencilIcon className="w-5 h-5" />,
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
                                .querySelector('meta[name="theme-color"]')
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
                        description: 'Reveal the unit count per quarter.',
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
                ],
            },
            {
                name: 'Advanced',
                display: <DotsHorizontalIcon className="w-5 h-5" />,
                options: [
                    {
                        name: 'clear_plan',
                        title: 'Clear plan',
                        description: `Clear all of your current plan data, which includes everything for each year and everything in My List. Make sure to save the current URL somewhere if you don't want to lose it.`,
                        buttonTextOn: 'Clear',
                        requireConfirmation: true,
                        singleAction: () => {
                            f2.clearData();
                        },
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
                        name: 'reduced_motion',
                        title: 'Reduced motion',
                        description: `With reduced motion enabled, most transform and layout animations across the site will be disabled.`,
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
            },
        ],
    },
});

export default settingsMenu;
