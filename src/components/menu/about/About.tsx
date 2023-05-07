import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Fragment, useState } from 'react';
import planImage from '../../../assets/plan.svg';
import saladImage from '../../../assets/salad.png';
import paperBlack from '../../../assets/paper-full-vertical-black.png';
import paperWhite from '../../../assets/paper-full-vertical-white.png';
import { InfoSetData, UserOptions } from '../../../types/BaseTypes';
import AboutButton from './AboutButton';
import InfoSet from './InfoSet';
import Account from '../../../Account';
import localforage from 'localforage';
import { PlanDataCache } from '../../../types/PlanTypes';
import Utility from '../../../utility/Utility';
import { ScheduleDataCache } from '../../../types/ScheduleTypes';

function getLocalTime<T>(location: string, key: keyof T) {
  return async () => {
    const data: any = await localforage.getItem<T>(location);
    if (!data) {
      return 'unused';
    }
    return Utility.formatCacheVersion(
      data[key] as string | number,
      'termId' in data ? (data['termId'] as string) : undefined
    );
  };
}

const versions: InfoSetData = [
  [
    'App Version',
    `${process.env.REACT_APP_VERSION || 'unknown'}-${
      process.env.REACT_APP_COMMIT || 'unknown'
    }`,
  ],
  [
    'API Version',
    async () => {
      const response = await fetch(Account.SERVER);
      const data = await response.json();
      return data.version;
    },
  ],
  ['Plan Cache Data Version', getLocalTime<PlanDataCache>('plan', 'updated')],
  [
    'Schedule Cache 0 Storage Version',
    getLocalTime<ScheduleDataCache>('schedule0', 'cacheUpdated'),
  ],
  [
    'Schedule Cache 0 Data Version',
    getLocalTime<ScheduleDataCache>('schedule0', 'dataUpdated'),
  ],
  [
    'Schedule Cache 1 Storage Version',
    getLocalTime<ScheduleDataCache>('schedule1', 'cacheUpdated'),
  ],
  [
    'Schedule Cache 1 Data Version',
    getLocalTime<ScheduleDataCache>('schedule1', 'dataUpdated'),
  ],
  [
    'Schedule Cache 2 Storage Version',
    getLocalTime<ScheduleDataCache>('schedule2', 'cacheUpdated'),
  ],
  [
    'Schedule Cache 2 Data Version',
    getLocalTime<ScheduleDataCache>('schedule2', 'dataUpdated'),
  ],
];

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
                <div className="flex w-full flex-col items-center gap-1 dark:text-white">
                  <img
                    src={dark ? paperWhite : paperBlack}
                    alt="paper.nu"
                    className="h-[172px]"
                  />
                  <p className="text-center font-light">
                    the ultimate Northwestern course planning tool
                  </p>
                  <p className="text-center text-sm font-bold text-gray-600 dark:text-gray-400">
                    VERSION {process.env.REACT_APP_VERSION}
                  </p>
                </div>
                <div className="my-8 flex w-full flex-col items-center justify-center gap-2 sm:flex-row sm:gap-4">
                  <AboutButton href="https://www.dilanxd.com/paper">
                    Learn More
                  </AboutButton>
                  <AboutButton href="https://kb.dilanxd.com/paper">
                    Help Center
                  </AboutButton>
                  <AboutButton href="https://www.dilanxd.com/paper/changelog">
                    Change Log
                  </AboutButton>
                  <AboutButton href="https://github.com/dilanx/paper.nu">
                    Source Code
                  </AboutButton>
                </div>
                <div className="my-8 flex flex-col items-center gap-2 text-center text-sm font-light">
                  <p>designed and developed by</p>
                  <p className="text-lg font-medium">
                    <a
                      className="text-black underline-offset-2 hover:underline dark:text-white"
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
                      className="text-black underline-offset-2 hover:underline dark:text-white"
                      href="https://www.mccormick.northwestern.edu/computer-science/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Northwestern Department of Computer Science
                    </a>
                  </p>
                  <p className="text-md font-medium">
                    <a
                      className="text-black underline-offset-2 hover:underline dark:text-white"
                      href="https://www.registrar.northwestern.edu"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Northwestern Office of the Registrar
                    </a>
                  </p>
                  <p className="text-md font-medium">
                    <a
                      className="text-black underline-offset-2 hover:underline dark:text-white"
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
                            className="underline underline-offset-4 hover:opacity-75"
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
                            className="underline underline-offset-4 hover:opacity-75"
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
                <div className="my-4">
                  <p className="text-center text-xs font-light">
                    Because all user data connected to Paper is managed by a
                    student and not the university itself, privacy rights
                    afforded to students through{' '}
                    <a
                      className="underline underline-offset-2 hover:opacity-75"
                      href="https://www.registrar.northwestern.edu/records/student-information-privacy/privacy-policy-ferpa.html"
                      target="_blank"
                      rel="noreferrer"
                    >
                      FERPA
                    </a>{' '}
                    do not apply here. Your Paper data is not affiliated in any
                    way with your official student records. See the{' '}
                    <a
                      className="underline underline-offset-2 hover:opacity-75"
                      href="https://www.dilanxd.com/privacy/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      privacy policy
                    </a>{' '}
                    to learn how your data is used.
                  </p>
                </div>
                <InfoSet title="more information" data={versions} />
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
