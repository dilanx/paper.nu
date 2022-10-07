import { InformationCircleIcon } from '@heroicons/react/outline';
import { AlertData } from '../../types/AlertTypes';

const aboutMenu = (version: string): AlertData => ({
    title: "It's that time of the year.",
    customSubtitle: (
        <p className="text-md font-light text-gray-500 dark:text-gray-400">
            SPAC 9. Tonight. Be there.
        </p>
    ),
    message:
        'The normal version of Plan Northwestern will return by tomorrow, October 8.',
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
        window.open('https://github.com/dilanx/plan-northwestern', '_blank');
    },
    options: [
        {
            name: 'about_change_log',
            title: `What's new?`,
            description: `Check out what changes have been made in the latest update.`,
            buttonTextOn: `Change Log`,
            singleAction: () => {
                window.open(
                    'https://github.com/dilanx/plan-northwestern/blob/main/CHANGELOG.md',
                    '_blank'
                );
            },
        },
        {
            name: 'about_feedback',
            title: 'Share your thoughts!',
            description: `Find any bugs, notice any errors in course data, or have any suggestions? Please send me a message on Instagram or create an issue on GitHub!`,
            buttonTextOn: 'Instagram',
            singleAction: () => {
                window.open('https://www.instagram.com/dilan4k/', '_blank');
            },
        },
        {
            name: 'about_discord',
            title: 'Join the Northwestern Discord server.',
            description: `Join the Northwestern University Discord server and connect with thousands of other students!`,
            buttonTextOn: 'Discord',
            singleAction: () => {
                window.open('https://discord.gg/aERJFBAhyP', '_blank');
            },
        },
    ],
});

export default aboutMenu;
