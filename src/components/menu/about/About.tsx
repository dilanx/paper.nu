import { Dialog, Transition } from '@headlessui/react';
import { PaperAirplaneIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Fragment, useState } from 'react';
import planImage from '../../../assets/plan.svg';
import saladImage from '../../../assets/salad.png';
import { UserOptions } from '../../../types/BaseTypes';
import AboutButton from './AboutButton';

interface AboutProps {
  switches: UserOptions;
  onClose: () => void;
}

function About({ switches, onClose }: AboutProps) {
  const [open, setOpen] = useState(true);

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
              <Dialog.Panel className="inline-block align-bottom bg-white text-black dark:text-gray-300 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full dark:bg-gray-700 p-8 relative">
                <div className="flex flex-col w-full items-center gap-2 dark:text-white">
                  <PaperAirplaneIcon className="w-10 h-10" />
                  <p className="font-light drop-shadow-md text-3xl tracking-wide text-center">
                    paper
                  </p>
                  <p className="font-light text-center">
                    the ultimate Northwestern course scheduling tool
                  </p>
                </div>
                <div className="my-8 flex flex-col sm:flex-row w-full justify-center items-center gap-2 sm:gap-4">
                  <AboutButton href="https://www.dilanxd.com/paper.nu">
                    Learn more
                  </AboutButton>
                  <AboutButton href="https://www.dilanxd.com/paper.nu">
                    Change log
                  </AboutButton>
                  <AboutButton href="https://github.com/dilanx/paper.nu">
                    Source code
                  </AboutButton>
                </div>
                <div className="flex flex-col items-center gap-2 text-center font-light text-sm my-8">
                  <p>designed and developed by</p>
                  <p className="font-medium text-lg">
                    <a
                      className="text-black dark:text-white hover:opacity-50"
                      href="https://www.dilanxd.com"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Dilan Nair
                    </a>
                  </p>
                  <p>in partnership with</p>
                  <p className="font-medium text-md">
                    <a
                      className="text-black dark:text-white hover:opacity-50"
                      href="https://www.mccormick.northwestern.edu/computer-science/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Northwestern Department of Computer Science
                    </a>
                  </p>
                  <p className="font-medium text-md">
                    <a
                      className="text-black dark:text-white hover:opacity-50"
                      href="https://www.registrar.northwestern.edu"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Northwestern Office of the Registrar
                    </a>
                  </p>
                  <p className="font-medium text-md">
                    <a
                      className="text-black dark:text-white hover:opacity-50"
                      href="https://www.it.northwestern.edu"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Northwestern Information Technology
                    </a>
                  </p>
                </div>
                <div className="flex flex-col items-center gap-2 font-light text-sm my-8">
                  <p>the future of</p>
                  <a
                    className="block w-full hover:opacity-75"
                    href="https://dilan.blog"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <div className="flex gap-2 flex-col sm:flex-row dark:text-black">
                      <div className="flex-1 p-4 rounded-xl bg-purple-50 dark:bg-purple-300 flex items-center gap-2">
                        <img
                          className="w-8 h-8"
                          src={planImage}
                          alt="Plan Northwestern logo"
                        />
                        <div className="text-center flex-grow">
                          <p className="font-medium">Plan Northwestern</p>
                          <p>by Dilan Nair</p>
                        </div>
                      </div>
                      <div className="flex-1 p-4 rounded-lg bg-green-50 dark:bg-green-300 flex items-center gap-2">
                        <img
                          className="w-8 h-8"
                          src={saladImage}
                          alt="salad.nu logo"
                        />
                        <div className="text-center flex-grow">
                          <p className="font-medium">salad.nu</p>
                          <p>by Andy Xu</p>
                        </div>
                      </div>
                    </div>
                  </a>
                </div>
                <div>
                  <p className="text-center text-sm font-bold text-gray-400">
                    VERSION {process.env.REACT_APP_VERSION}
                  </p>
                </div>
                <button
                  className="absolute top-2 right-2"
                  onClick={() => setOpen(false)}
                >
                  <XMarkIcon
                    className="w-8 h-8 text-gray-300 hover:text-black active:text-gray-600
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
