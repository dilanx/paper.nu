import { LifebuoyIcon } from '@heroicons/react/24/outline';
import { AlertData } from '../../types/AlertTypes';

const helpMenu = (): AlertData => ({
  title: 'Help & Feedback',
  message:
    'Find answers to common questions along with effective ways to use the app in the help center! You can also report bugs and suggest new features there.',
  icon: LifebuoyIcon,
  color: 'violet',
  cancelButton: 'Close',
  confirmButton: 'Go to the help center',
  action: () => {
    window.open('https://www.dilanxd.com/kb?f=paper', '_blank');
  },
});

export default helpMenu;
