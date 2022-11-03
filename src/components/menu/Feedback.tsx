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
  textHTML: (
    <div className="mt-8 text-gray-700 dark:text-gray-300">
      <hr className="my-2 border-gray-700 dark:border-gray-300" />
      <p className="text-lg font-bold">BEFORE SUBMITTING...</p>
      <p className="my-2">
        Check if your issue has already been reported by visiting the{' '}
        <a
          href="https://feedback.dilanxd.com/app/paper.nu"
          target="_blank"
          rel="noreferrer"
        >
          feedback site
        </a>
        . You can also see the status of your submissions and developer
        responses.
      </p>
      <p className="my-2">
        If you're submitting feedback about courses that have just been updated
        on CAESAR recently, wait a bit first.{' '}
        <strong>
          Paper automatically refreshes course data every Monday, Wednesday, and
          Friday at around 2:00 PM CT
        </strong>
        . If the CAESAR data was updated before the most recent Paper refresh
        and it's still missing,{' '}
        <strong>try clearing your local course data cache</strong> in the Paper
        settings (gear button at the bottom of the sidebar). If the data is
        still missing, then submit feedback.
      </p>
      <hr className="my-2 border-gray-700 dark:border-gray-300" />
    </div>
  ),
  // options: [
  //   {
  //     title: 'View current submissions',
  //     description:
  //       'BEFORE SUBMITTING, PLEASE CHECK IF YOUR ISSUE HAS ALREADY BEEN REPORTED! You can also see the status of your submission.',
  //     buttonTextOn: 'View All Feedback',
  //     singleAction: () => {
  //       window.open('https://feedback.dilanxd.com/app/paper.nu', '_blank');
  //     },
  //   },
  // ],
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
