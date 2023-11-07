import { Dialog, Transition } from '@headlessui/react';
import { ChevronRightIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { UserIcon } from '@heroicons/react/24/solid';
import { Fragment, useEffect, useState } from 'react';
import Account from '../../Account';
import { getTermName } from '../../DataManager';
import PlanManager from '../../PlanManager';
import { Alert } from '../../types/AlertTypes';
import { UserOptions } from '../../types/BaseTypes';
import { CourseRatings, RatingsViewData } from '../../types/RatingTypes';
import { PaperError } from '../../utility/PaperError';
import Utility from '../../utility/Utility';

interface RatingsProps {
  data: RatingsViewData;
  alert: Alert;
  switches: UserOptions;
  onClose: () => void;
}

export default function Ratings({
  data,
  alert,
  switches,
  onClose,
}: RatingsProps) {
  const [open, setOpen] = useState(true);
  const [state, setState] = useState<
    'loading' | 'not-logged-in' | 'not-found' | 'done'
  >('loading');
  const [ratings, setRatings] = useState<CourseRatings | null>(null);

  const color = PlanManager.getCourseColor(data.course);

  useEffect(() => {
    setState('loading');
    setRatings(null);
    if (Account.isLoggedIn()) {
      Account.getDetailedRatings(data.course)
        .then((ratings) => {
          if (!ratings) {
            setState('not-logged-in');
            return;
          }

          setState('done');
          setRatings(ratings);
          console.log(ratings);
        })
        .catch((error: PaperError) => {
          if (error.status === 404) {
            setState('not-found');
            return;
          }
          alert(Utility.errorAlert('account_get_plans', error));
        });
    } else {
      setState('not-logged-in');
    }
  }, [data.course, alert]);

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog
        as="div"
        className={`${switches.get.dark ? 'dark' : ''} relative z-40`}
        onClose={() => setOpen(false)}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          afterLeave={() => onClose()}
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-y-auto">
          <div className="relative flex h-screen w-screen items-center justify-center p-4 text-center md:p-16">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="relative flex h-full w-full flex-col overflow-hidden rounded-lg bg-white p-2 text-left dark:bg-gray-700">
                <div className="flex flex-1 flex-col md:flex-row">
                  {ratings && (
                    <>
                      <div className="w-full max-w-sm p-4">
                        <div className="text-left">
                          <p className="text-xs font-bold tracking-wide text-gray-500">
                            PAPER RATINGS
                          </p>
                          <p className={`text-3xl font-bold text-${color}-500`}>
                            {data.course}
                          </p>
                        </div>
                        <div className="my-4">
                          {Object.keys(ratings)
                            .sort((a, b) => b.localeCompare(a))
                            .map((termId) => (
                              <div className="my-2 flex flex-col items-start gap-1">
                                <p className="text-lg text-gray-500">
                                  {getTermName(termId)}
                                </p>
                                {Object.keys(ratings[termId]).map((prof) => (
                                  <button className="flex items-center gap-1 rounded-md p-1 hover:bg-gray-100">
                                    <UserIcon className="h-4 w-4" />
                                    <span>{prof}</span>
                                    <ChevronRightIcon className="h-3 w-3" />
                                  </button>
                                ))}
                              </div>
                            ))}
                        </div>
                      </div>
                      <div className="flex flex-1 border border-red-500"></div>
                    </>
                  )}
                </div>
                <div className="p-4">
                  <p className="text-center text-xs text-gray-400">
                    Paper Ratings is not connected to nor intended to replace
                    CTECs. Make sure to complete your CTECs for access to
                    detailed ratings and comments.
                  </p>
                </div>
                <button
                  className="absolute right-2 top-2"
                  onClick={() => setOpen(false)}
                >
                  <XMarkIcon
                    className="h-8 w-8 text-gray-300 hover:text-black active:text-gray-600
                    dark:text-gray-500 dark:hover:text-white dark:active:text-gray-300"
                  />
                </button>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
