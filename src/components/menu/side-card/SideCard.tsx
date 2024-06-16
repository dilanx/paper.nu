import { useApp } from '@/app/Context';
import ActionButton from '@/components/generic/ActionButton';
import Tooltip from '@/components/generic/Tooltip';
import { SideCardData } from '@/types/SideCardTypes';
import { Dialog, Transition } from '@headlessui/react';
import { CheckIcon, LinkIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Fragment, useEffect, useRef, useState } from 'react';
import SideCardButton from './SideCardButton';
import SideCardItem from './SideCardItem';

interface SideCardProps {
  data: SideCardData;
  onClose: () => void;
}

function SideCard({ data, onClose }: SideCardProps) {
  const { userOptions } = useApp();
  const [isOpen, setIsOpen] = useState(true);
  const [hasCopied, setHasCopied] = useState(false);

  const initialFocus = useRef(null);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setHasCopied(false);
    }, 2000);

    return () => {
      clearTimeout(timeout);
    };
  }, [hasCopied]);

  function close() {
    setIsOpen(false);
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        initialFocus={initialFocus}
        className={`${userOptions.get.dark ? 'dark' : ''} relative z-40`}
        onClose={() => close()}
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
          <div className="fixed inset-0 bg-black bg-opacity-10" />
        </Transition.Child>
        <div className="fixed right-0 top-0 h-screen w-screen px-4 py-8 md:max-w-md">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="translate-x-[448px]"
            enterTo="translate-x-0"
            leave="ease-out duration-200"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-[448px]"
          >
            <Dialog.Panel className="no-scrollbar h-full w-full overflow-y-scroll rounded-xl bg-white p-4 shadow-xl dark:bg-gray-700">
              <div
                ref={initialFocus}
                className="mb-6 flex w-full items-center gap-2"
              >
                <p
                  className={`flex-grow text-sm font-bold tracking-wider text-gray-600 dark:text-gray-400`}
                >
                  {data.type}
                </p>
                <div className="flex items-center gap-2">
                  {data.link && (
                    <ActionButton
                      padding="large"
                      onClick={() => {
                        if (data.link) {
                          navigator.clipboard.writeText(data.link);
                          setHasCopied(true);
                        }
                      }}
                    >
                      {hasCopied ? (
                        <CheckIcon className="h-5 w-5" />
                      ) : (
                        <LinkIcon className="h-5 w-5" />
                      )}
                      <Tooltip className="-bottom-9 right-0 w-40" color="gray">
                        {hasCopied
                          ? 'Copied to clipboard!'
                          : 'Copy link to information'}
                      </Tooltip>
                    </ActionButton>
                  )}
                  <ActionButton onClick={() => close()}>
                    <XMarkIcon className="h-7 w-7" />
                    <Tooltip className="-bottom-9 right-0" color="gray">
                      Close
                    </Tooltip>
                  </ActionButton>
                </div>
              </div>
              {data.alertMessage && (
                <div className="my-4 rounded-lg border-2 border-red-500 bg-red-100 p-2 dark:border-red-400 dark:bg-gray-700">
                  <p className="text-center text-sm font-medium text-red-600 dark:text-red-300">
                    {data.alertMessage}
                  </p>
                </div>
              )}
              {data.tag && (
                <p className={`text-xs font-bold text-${data.tag.color}-400`}>
                  {data.tag.text}
                </p>
              )}
              <p className="text-center text-2xl font-bold text-gray-800 dark:text-gray-50 sm:text-left">
                {data.title}
              </p>
              {data.subtitle && (
                <p className="text-center text-lg font-light text-gray-800 dark:text-gray-100 sm:text-left">
                  {data.subtitle}
                </p>
              )}
              {data.message && (
                <p className="my-4 text-sm text-gray-600 dark:text-gray-400">
                  {data.message}
                </p>
              )}
              {data.toolbar && (
                <div className="my-2 flex items-center justify-end">
                  {data.toolbar}
                </div>
              )}
              {data.items && (
                <div className="my-4">
                  {data.items.map((item, i) => (
                    <SideCardItem
                      key={`side-card-item-${i}`}
                      data={item}
                      color={data.themeColor}
                    />
                  ))}
                </div>
              )}
              {data.buttons && (
                <div className="m-4 mt-8">
                  {data.buttons.map((button, i) =>
                    button === 'divider' ? (
                      <div
                        className="m-2 h-0.5 rounded-sm bg-gray-100"
                        key={`side-card-button-${i}`}
                      />
                    ) : (
                      <SideCardButton
                        key={`side-card-button-${i}`}
                        data={button}
                        close={close}
                      />
                    )
                  )}
                </div>
              )}
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}

export default SideCard;
