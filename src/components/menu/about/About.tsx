import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Fragment, useState } from 'react';
import planImage from '../../../assets/plan.svg';
import saladImage from '../../../assets/salad.png';
import paperBlack from '../../../assets/paper-full-vertical-black.png';
import paperWhite from '../../../assets/paper-full-vertical-white.png';
import { UserOptions } from '../../../types/BaseTypes';
import AboutButton from './AboutButton';

interface AboutProps {
  switches: UserOptions;
  onClose: () => void;
}

function About({ switches, onClose }: AboutProps) {
  const [open, setOpen] = useState(true);
  const dark = switches.get.dark;

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog
        as="div"
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
              <Dialog.Panel className="relative inline-block w-full transform overflow-hidden rounded-lg bg-white p-8 text-left align-bottom text-black shadow-xl transition-all dark:bg-gray-700 dark:text-gray-300 sm:my-8 sm:max-w-lg sm:align-middle">
                <div className="flex w-full flex-col items-center gap-2 dark:text-white">
                  <img
                    src={dark ? paperWhite : paperBlack}
                    alt="paper.nu"
                    className="h-[172px]"
                  />
                  <p className="text-center font-light">
                    the ultimate Northwestern course planning tool
                  </p>
                </div>
                <div className="my-8 flex w-full flex-col items-center justify-center gap-2 sm:flex-row sm:gap-4">
                  <AboutButton href="https://www.dilanxd.com/paper">
                    Learn more
                  </AboutButton>
                  <AboutButton href="https://www.dilanxd.com/paper/changelog">
                    Change log
                  </AboutButton>
                  <AboutButton href="https://github.com/dilanx/paper.nu">
                    Source code
                  </AboutButton>
                </div>
                <div className="my-8 flex flex-col items-center gap-2 text-center text-sm font-light">
                  <p>designed and developed by</p>
                  <p className="text-lg font-medium">
                    <a
                      className="text-black hover:opacity-50 dark:text-white"
                      href="https://www.dilanxd.com"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Dilan Nair
                    </a>
                  </p>
                  <p>in partnership with</p>
                  <p className="text-md font-medium">
                    <a
                      className="text-black hover:opacity-50 dark:text-white"
                      href="https://www.mccormick.northwestern.edu/computer-science/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Northwestern Department of Computer Science
                    </a>
                  </p>
                  <p className="text-md font-medium">
                    <a
                      className="text-black hover:opacity-50 dark:text-white"
                      href="https://www.registrar.northwestern.edu"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Northwestern Office of the Registrar
                    </a>
                  </p>
                  <p className="text-md font-medium">
                    <a
                      className="text-black hover:opacity-50 dark:text-white"
                      href="https://www.it.northwestern.edu"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Northwestern Information Technology
                    </a>
                  </p>
                </div>
                <div className="my-8 flex flex-col items-center gap-2 text-sm font-light">
                  <p>the future of</p>
                  <div className="flex w-full flex-col gap-2 dark:text-black sm:flex-row">
                    <div className="flex flex-1 items-center gap-2 rounded-xl bg-purple-50 p-4 dark:bg-purple-300">
                      <img
                        className="h-8 w-8"
                        src={planImage}
                        alt="Plan Northwestern logo"
                      />
                      <div className="flex-grow text-center">
                        <p className="font-medium">Plan Northwestern</p>
                        <p>
                          by{' '}
                          <a
                            className="underline underline-offset-4 hover:opacity-50"
                            href="https://www.dilanxd.com"
                            target="_blank"
                            rel="noreferrer"
                          >
                            Dilan Nair
                          </a>
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-1 items-center gap-2 rounded-lg bg-green-50 p-4 dark:bg-green-300">
                      <img
                        className="h-8 w-8"
                        src={saladImage}
                        alt="salad.nu logo"
                      />
                      <div className="flex-grow text-center">
                        <p className="font-medium">salad.nu</p>
                        <p>
                          by{' '}
                          <a
                            className="underline underline-offset-4 hover:opacity-50"
                            href="https://github.com/Everthings"
                            target="_blank"
                            rel="noreferrer"
                          >
                            Andy Xu
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-center text-xs font-bold text-gray-600 dark:text-gray-400">
                    PAPER.NU VERSION {process.env.REACT_APP_VERSION}
                  </p>
                </div>
                <button
                  className="absolute top-2 right-2"
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

export default About;