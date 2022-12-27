import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useRef, useState } from 'react';
import {
  ChangeLogPreviewInformation,
  UserOptions,
} from '../../types/BaseTypes';
import paperBlack from '../../assets/paper-full-black.png';
import paperWhite from '../../assets/paper-full-white.png';

interface ChangeLogPreviewProps {
  switches: UserOptions;
  info: ChangeLogPreviewInformation;
  onClose: () => void;
}

function ChangeLogPreview({ switches, info, onClose }: ChangeLogPreviewProps) {
  const [open, setOpen] = useState(true);
  const dark = switches.get.dark;

  const initialFocus = useRef(null);

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog
        as="div"
        initialFocus={initialFocus}
        className={`${dark ? 'dark' : ''} relative z-40`}
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
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all dark:bg-gray-700 sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
                <div className="flex w-full flex-col items-center gap-2 p-8 dark:text-white">
                  <img
                    src={dark ? paperWhite : paperBlack}
                    alt="paper.nu"
                    className="h-[40px]"
                    ref={initialFocus}
                  />
                  <p className="text-center text-xl font-medium">
                    What's new in version {process.env.REACT_APP_VERSION}
                  </p>
                  <p className="mb-4 text-center text-sm font-light text-gray-600 dark:text-gray-300">
                    This version brings a combination of things I wanted to add
                    and features that you all requested. Here are some of the
                    big ones. Check it out!
                  </p>
                  <ul className="w-full list-disc">
                    {info.items.map(({ title, description }, i) => (
                      <li className="my-4" key={`clp-item-${i}`}>
                        <p className="font-medium">{title}</p>
                        <p className="text-sm font-light">{description}</p>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-gray-50 px-4 py-3 dark:bg-gray-800 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2
                                text-base font-medium text-gray-700 shadow-sm hover:bg-gray-100 active:bg-gray-200 active:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600
                                dark:active:bg-gray-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => setOpen(false)}
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2
                                text-base font-medium text-gray-700 shadow-sm hover:bg-gray-100 active:bg-gray-200 active:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600
                                dark:active:bg-gray-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => {
                      window.open(
                        'https://www.dilanxd.com/paper/changelog',
                        '_blank'
                      );
                    }}
                  >
                    View all changes in v{process.env.REACT_APP_VERSION}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

export default ChangeLogPreview;
