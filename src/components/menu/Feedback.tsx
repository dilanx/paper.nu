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
    onSubmit: ({ type }) => {
      // TODO handle feedback submission
    },
  },
  confirmButton: 'Submit',
  cancelButton: 'Cancel',
});

export default feedbackMenu;
