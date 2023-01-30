import paperBlack from '../../assets/paper-full-black.png';
import paperWhite from '../../assets/paper-full-white.png';

interface InfoProps {
  dark?: boolean;
  openAboutMenu: () => void;
}

function Info({ dark, openAboutMenu }: InfoProps) {
  return (
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
  );
}

export default Info;
