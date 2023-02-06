import paperBlack from '../../assets/paper-full-black.png';
import paperWhite from '../../assets/paper-full-white.png';
import { Alert } from '../../types/AlertTypes';
import { switchTermAlert } from '../search/Search';

interface InfoProps {
  dark?: boolean;
  openAboutMenu: () => void;
  newerTermAvailable?: boolean;
  alert: Alert;
  currentTermId?: string;
  switchTerm: (termId: string) => void;
}

function Info({
  dark,
  openAboutMenu,
  newerTermAvailable,
  alert,
  currentTermId,
  switchTerm,
}: InfoProps) {
  return (
    <>
      <button
        className="mt-4 mb-2 flex flex-col items-center justify-center rounded-lg px-4
      transition-all duration-150 hover:bg-gray-100 active:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 dark:active:bg-gray-600"
        onClick={() => openAboutMenu()}
      >
        <img
          src={dark ? paperWhite : paperBlack}
          alt="paper.nu"
          className="h-[52px]"
        />
      </button>
      {newerTermAvailable && (
        <button
          className="mb-2 rounded-md text-center text-xs font-bold
            text-violet-600 hover:bg-violet-600 hover:text-white active:bg-violet-500 active:text-white
            dark:text-violet-400 dark:hover:bg-violet-400 dark:hover:text-gray-800 dark:active:bg-violet-300 dark:active:text-gray-800"
          onClick={() => {
            alert(switchTermAlert(switchTerm, currentTermId));
          }}
        >
          COURSES FOR A NEWER TERM ARE AVAILABLE
        </button>
      )}
    </>
  );
}

export default Info;
