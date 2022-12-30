import { PencilSquareIcon } from '@heroicons/react/24/outline';
import { AlertData } from '../../types/AlertTypes';

const feedbackMenu = (): AlertData => ({
  title: 'Feedback submission unavailable',
  message:
    'The built-in feedback submission feature has been removed in favor of a new help center and feedback system currently in development. In the meantime, feel free to contact me if you need help!',
  icon: PencilSquareIcon,
  color: 'violet',
  cancelButton: 'Close',
});

export default feedbackMenu;
