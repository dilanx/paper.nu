import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useRef, useState } from 'react';
import {
  ChangeLogPreviewInformation,
  UserOptions,
} from '../../types/BaseTypes';
import paperBlack from '../../assets/paper-full-black.png';
import paperWhite from '../../assets/paper-full-white.png';
import Links from '../../utility/StaticLinks';

interface ChangeLogPreviewProps {
  version: string;
  switches: UserOptions;
  info: ChangeLogPreviewInformation;
  onClose: () => void;
}

function ChangeLogPreview({
  version,
  switches,
  info,
  onClose,
}: ChangeLogPreviewProps) {
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
                <div className="flex w-full flex-col items-center p-8 dark:text-white">
                  <img
                    src={dark ? paperWhite : paperBlack}
                    alt="paper.nu"
                    className="h-[64px]"
                    ref={initialFocus}
                  />
                  <p className="my-4 text-center text-lg font-light text-gray-600 dark:text-gray-300">
                    the ultimate Northwestern course planning tool
                  </p>
                  <p className="text-center text-sm font-bold tracking-wide">
                    WHAT'S NEW IN VERSION {version}
                  </p>
                  <ul className="w-full list-disc">
                    {info.items.map(({ title, description }, i) => (
                      <li className="my-4" key={`clp-item-${i}`}>
                        <p className="font-bold">{title}</p>
                        <p className="text-sm font-normal">{description}</p>
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
                      if (info.link) {
                        window.open(info.link.url, '_blank');
                        return;
                      }
                      window.open(Links.CHANGELOG, '_blank');
                    }}
                  >
                    {info.link
                      ? info.link.text
                      : `View all changes in v${version}`}
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
