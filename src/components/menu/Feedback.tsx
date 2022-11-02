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
  options: [
    {
      title: 'View current submissions',
      description:
        'BEFORE SUBMITTING, PLEASE CHECK IF YOUR ISSUE HAS ALREADY BEEN REPORTED! You can also see the status of your submission.',
      buttonTextOn: 'View All Feedback',
      singleAction: () => {
        window.open('https://feedback.dilanxd.com/app/paper.nu', '_blank');
      },
    },
  ],
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
            data
              .json()
              .then((data) => {
                toast.success(
                  () => (
                    <span>
                      Feedback submitted!{' '}
                      <a
                        className="text-violet-500 dark:text-violet-400 hover:underline"
                        href={`https://feedback.dilanxd.com/item/${data.id}`}
                      >
                        View
                      </a>
                    </span>
                  ),
                  { id }
                );
              })
              .catch(() => {
                toast.error('Failed to submit feedback', { id });
              });
          } else {
            toast.error('Failed to submit feedback', { id });
          }
        })
        .catch(() => {
          toast.error('Failed to submit feedback', { id });
        });
    },
  },
  confirmButton: 'Submit',
  cancelButton: 'Cancel',
});

export default feedbackMenu;
