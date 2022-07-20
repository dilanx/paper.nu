import { InformationCircleIcon } from '@heroicons/react/outline';
import { AlertData } from '../../types/AlertTypes';

const aboutMenu = (version: string): AlertData => ({
    title: 'Plan Northwestern',
    customSubtitle: (
        <p className="text-md font-light text-gray-500 dark:text-gray-400">
            version {version} by{' '}
            <a
                className="text-purple-500 dark:text-purple-300 opacity-100 hover:opacity-60 transition-all duration-150"
                href="https://www.dilanxd.com"
                target="_blank"
                rel="noreferrer"
            >
                Dilan N
            </a>
        </p>
    ),
    message:
        'An easy and organized way to plan out your classes at Northwestern. Data is all saved in the URL, so save the link to your plan to access it later or share with friends. You can also create an account and save your plans there.',
    confirmButton: 'View on GitHub',
    confirmButtonColor: 'purple',
    cancelButton: 'Close',
    iconColor: 'purple',
    icon: InformationCircleIcon,
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
