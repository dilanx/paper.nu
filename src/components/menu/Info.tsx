import paperBlack from '../../assets/paper-full-black.png';
import paperWhite from '../../assets/paper-full-white.png';

interface InfoProps {
  dark?: boolean;
}

function Info({ dark }: InfoProps) {
  return (
    <div
      className={`mt-4 mb-2 flex items-center justify-center gap-2 whitespace-nowrap px-4 text-center text-black transition-all duration-300 dark:bg-gray-800 dark:text-white`}
    >
      <img
        src={dark ? paperWhite : paperBlack}
        alt="paper.nu"
        className="h-[52px]"
      />
    </div>
  );
}

export default Info;
