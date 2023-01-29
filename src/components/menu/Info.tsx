import paperBlack from '../../assets/paper-full-black.png';
import paperWhite from '../../assets/paper-full-white.png';

interface InfoProps {
  dark?: boolean;
}

function Info({ dark }: InfoProps) {
  return (
    <button
      className="mt-4 mb-2 flex flex-col items-center justify-center whitespace-nowrap px-4
        text-center text-black transition-all duration-300 dark:bg-gray-800 dark:text-white"
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
