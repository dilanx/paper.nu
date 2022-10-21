import { PencilSquareIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { AlertData } from '../../types/AlertTypes';

const feedbackMenu = (): AlertData => ({
  title: 'Ready to share!',
  message:
    'All of your plan data is stored in the URL. When you make changes to your plan, the URL is updated to reflect those changes. Save it somewhere, or share with a friend!',
  confirmButton: 'Copy to clipboard',
  confirmButtonColor: 'violet',
  cancelButton: 'Close',
  iconColor: 'violet',
  icon: PencilSquareIcon,
  textView: window.location.href,
  action: () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('URL copied to clipboard');
  },
});

export default feedbackMenu;
