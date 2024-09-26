import { useApp } from '@/app/Context';
import discordLogo from '@/assets/discord.svg';
import instagramLogo from '@/assets/instagram.svg';
import paperBlack from '@/assets/paper-full-vertical-black.png';
import paperWhite from '@/assets/paper-full-vertical-white.png';
import ActionButton from '@/components/generic/ActionButton';
import { INFO_VERSIONS } from '@/utility/InfoSets';
import Links from '@/utility/StaticLinks';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Fragment, useState } from 'react';
import AboutBanner from './AboutBanner';
import AboutButton from './AboutButton';
import InfoSet from './InfoSet';

interface AboutProps {
  onClose: () => void;
}

function About({ onClose }: AboutProps) {
  const { userOptions } = useApp();
  const [open, setOpen] = useState(true);
  const dark = userOptions.get.dark;

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
                  <p className="text-center text-lg font-bold text-gray-600 dark:text-gray-400">
                    version {process.env.REACT_APP_VERSION}
                  </p>
                </div>
                <div className="my-8 flex w-full flex-col items-center justify-center gap-2 sm:flex-row sm:gap-4">
                  <AboutButton href={Links.HOMEPAGE}>Learn More</AboutButton>
                  <AboutButton href={Links.SUPPORT}>Help Center</AboutButton>
                  <AboutButton href={Links.CHANGELOG}>Change Log</AboutButton>
                  <AboutButton href={Links.SOURCE_CODE}>
                    Source Code
                  </AboutButton>
                </div>
                <div className="m-8 flex flex-col items-center justify-center gap-2">
                  <AboutBanner
                    href="https://www.instagram.com/paper.nu"
                    color="#ff0069"
                    img={instagramLogo}
                    alt="Instagram"
                  >
                    Follow <span className="font-bold">paper.nu</span> on
                    Instagram.
                  </AboutBanner>
                  <AboutBanner
                    href="https://discord.com/servers/northwestern-655629737888055317"
                    color="#5865f2"
                    img={discordLogo}
                    alt="Discord"
                  >
                    Join the <span className="font-bold">Northwestern</span>{' '}
                    Discord server.
                  </AboutBanner>
                </div>
                <div className="my-8 flex flex-col items-center gap-2 text-center text-sm font-light">
                  <p>designed and developed by</p>
                  <p className="text-2xl font-medium">
                    <a
                      className="text-black underline-offset-2 hover:underline dark:text-white"
                      href={Links.DEVELOPER}
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
                      href={Links.NU_CS}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Northwestern Department of Computer Science
                    </a>
                  </p>
                  <p className="text-md font-medium">
                    <a
                      className="text-black underline-offset-2 hover:underline dark:text-white"
                      href={Links.NU_REGISTRAR}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Northwestern Office of the Registrar
                    </a>
                  </p>
                  <p className="text-md font-medium">
                    <a
                      className="text-black underline-offset-2 hover:underline dark:text-white"
                      href={Links.NU_IT}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Northwestern Information Technology
                    </a>
                  </p>
                </div>
                <div className="my-4 text-center text-xs font-light">
                  <p className="my-2">
                    Because all user data connected to Paper is managed by a
                    student and not the university itself, privacy rights
                    afforded to students through{' '}
                    <a
                      className="underline underline-offset-2 hover:opacity-75"
                      href={Links.FERPA}
                      target="_blank"
                      rel="noreferrer"
                    >
                      FERPA
                    </a>{' '}
                    do not apply here. Your Paper data is not affiliated in any
                    way with your official student records. See the{' '}
                    <a
                      className="underline underline-offset-2 hover:opacity-75"
                      href={Links.PRIVACY}
                      target="_blank"
                      rel="noreferrer"
                    >
                      privacy policy
                    </a>{' '}
                    to learn how your data is used.
                  </p>
                  <p className="my-2">
                    <a
                      className="underline underline-offset-2 hover:opacity-75"
                      href={Links.ATTRIBUTIONS}
                      target="_blank"
                      rel="noreferrer"
                    >
                      View project attributions
                    </a>
                  </p>
                </div>
                <InfoSet title="MORE INFORMATION" data={INFO_VERSIONS} />
                <div className="absolute right-2 top-2">
                  <ActionButton onClick={() => setOpen(false)}>
                    <XMarkIcon className="h-7 w-7" />
                  </ActionButton>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

export default About;
