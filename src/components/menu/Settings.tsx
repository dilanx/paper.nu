import {
  CalendarIcon,
  Cog6ToothIcon,
  RectangleStackIcon,
  EllipsisHorizontalIcon,
} from '@heroicons/react/24/outline';
import debugModule from 'debug';
import { AlertData } from '../../types/AlertTypes';
import { PlanSpecialFunctions } from '../../types/PlanTypes';
import Utility from '../../utility/Utility';

const settingsMenu = (f2: PlanSpecialFunctions): AlertData => ({
  title: 'Settings',
  message: `Customize your Paper experience with! These settings are saved in your browser and not in the URL.`,
  cancelButton: 'Close',
  color: 'orange',
  icon: Cog6ToothIcon,
  tabs: {
    switchName: 'settings_tab',
    colorMap: {
      General: 'orange',
      Plan: 'purple',
      Schedule: 'green',
      Advanced: 'gray',
    },
    tabs: [
      {
        name: 'General',
        display: <Cog6ToothIcon className="w-5 h-5" />,
        options: [
          {
            switch: 'dark',
            title: 'Dark mode',
            description: `Become one with the night.`,
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
            switch: 'save_location_top',
            title: 'Save button location',
            description: `When editing a plan or schedule linked to your account that has unsaved changes, a save button appears at the bottom right of the window by default. You can move it to the top right if you'd prefer.`,
            buttonTextOn: 'Top right',
            buttonTextOff: 'Bottom right',
            saveToStorage: true,
          },
        ],
      },
      {
        name: 'Plan',
        display: <RectangleStackIcon className="w-5 h-5" />,
        options: [
          {
            switch: 'compact',
            title: 'Compact mode',
            description: `It's a bit uglier I think, but you can view more on the screen at once without needing to scroll.`,
            saveToStorage: true,
          },
          {
            switch: 'quarter_units',
            title: 'Show units per quarter',
            description: 'Reveal the unit count per quarter.',
            saveToStorage: true,
          },
          {
            switch: 'more_info',
            title: 'Show more info on classes',
            description: `See prerequisites and distribution areas on the class items without having to click on their info button. The info won't display if compact mode is enabled.`,
            saveToStorage: true,
          },
          {
            title: 'Clear plan',
            description: `Clear all of your current plan data, which includes everything for each year and everything in My List. Make sure to save the current URL somewhere if you don't want to lose it.`,
            buttonTextOn: 'Clear',
            confirmation: 'clear_plan',
            singleAction: () => {
              f2.clearData();
            },
          },
        ],
      },
      {
        name: 'Schedule',
        display: <CalendarIcon className="w-5 h-5" />,
        options: [
          {
            switch: 'show_times',
            title: 'Show class times',
            description: `See the start and end time for each class on the schedule.`,
            saveToStorage: true,
          },
          {
            switch: 'schedule_warnings',
            title: 'Schedule warnings',
            description: `You'll get warnings for trying things like adding a conflicting section to your schedule.`,
            saveToStorage: true,
          },
        ],
      },
      {
        name: 'Advanced',
        display: <EllipsisHorizontalIcon className="w-5 h-5" />,
        options: [
          {
            switch: 'reduced_motion',
            title: 'Reduced motion',
            description: `With reduced motion enabled, most transform and layout animations across the site will be disabled.`,
            saveToStorage: true,
          },
          {
            switch: 'debug',
            title: 'Debug mode',
            description: `Log messages will print into your browser's console (verbose log level is required).`,
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
