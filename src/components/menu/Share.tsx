import { ExternalLinkIcon } from '@heroicons/react/outline';
import toast from 'react-hot-toast';
import { AlertData } from '../../types/AlertTypes';

const shareMenu = (): AlertData => ({
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

export default shareMenu;
