import { PencilSquareIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { AlertData } from '../../types/AlertTypes';
import { feedbackForm } from '../../utility/Forms';

const feedbackMenu = (): AlertData => ({
  title: 'Leave some feedback!',
  message:
    'Find a bug or notice some courses are missing? Have a cool feature suggestion? Let us know!',
  icon: PencilSquareIcon,
  color: 'violet',
  form: {
    sections: feedbackForm(),
    onSubmit: ({ type, message, email, share }) => {
      let data: string | undefined = undefined;
      if (share === 'Yes') {
        data = decodeURIComponent(window.location.search);
        if (data.startsWith('?')) data = data.substring(1);
      }
      const id = toast.loading('Submitting feedback...');

      fetch('https://auth.dilanxd.com/plan-nu/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type,
          message,
          email: email || undefined,
          data,
        }),
      })
        .then((data) => {
          if (data.ok) {
            toast.success('Feedback submitted!', { id });
          } else {
            toast.error('Failed to submit feedback', { id });
          }
        })
        .catch((err) => {
          toast.error('Failed to submit feedback', { id });
        });
    },
  },
  confirmButton: 'Submit',
  cancelButton: 'Cancel',
});

export default feedbackMenu;
