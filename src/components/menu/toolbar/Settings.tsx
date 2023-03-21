import {
  CalendarIcon,
  Cog6ToothIcon,
  RectangleStackIcon,
  EllipsisHorizontalIcon,
} from '@heroicons/react/24/outline';
import debugModule from 'debug';
import { clearCache } from '../../../DataManager';
import { AlertData } from '../../../types/AlertTypes';
import { PlanSpecialFunctions } from '../../../types/PlanTypes';
import Utility from '../../../utility/Utility';

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
        display: <Cog6ToothIcon className="h-5 w-5" />,
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
            switch: 'use_url',
            title: 'Save data to URL',
            description:
              "By default, your plan and schedule data is saved to the URL. However, that can get a bit annoying if your browser keeps routing to an old link. If you just use your account or browser storage to save your plans and schedules, you can disable URL saving. You won't be able to open Paper links while this setting is disabled unless they're shortened.",
            saveToStorage: true,
          },
          {
            title: 'Clear local course data cache',
            description:
              'This clears all of the course data stored in your browser. Clearing the data cache will not delete any plans or schedules, including ones saved in your browser. THE SITE WILL RELOAD!',
            buttonTextOn: 'Clear',
            confirmation: 'clear_local_cache',
            singleAction: () => {
              clearCache().finally(() => {
                window.location.reload();
              });
            },
          },
        ],
      },
      {
        name: 'Plan',
        display: <RectangleStackIcon className="h-5 w-5" />,
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
            description: `Clear all of your current plan data, which includes everything for each year and everything in your bookmarks. Make sure to save the current URL somewhere if you don't want to lose it.`,
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
        display: <CalendarIcon className="h-5 w-5" />,
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
        display: <EllipsisHorizontalIcon className="h-5 w-5" />,
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
