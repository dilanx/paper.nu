import paperBlack from '../../assets/paper-full-black.png';
import paperWhite from '../../assets/paper-full-white.png';

interface InfoProps {
  dark?: boolean;
}

function Info({ dark }: InfoProps) {
  return (
    <div
      className={`flex items-center gap-2 justify-center mt-4 mb-2 px-4 text-center whitespace-nowrap dark:bg-gray-800 transition-all duration-300 text-black dark:text-white`}
    >
      {dark ? (
        <img src={paperWhite} alt="paper.nu" className="h-[52px]" />
      ) : (
        <img src={paperBlack} alt="paper.nu" className="h-[52px]" />
      )}
    </div>
  );
}

export default Info;
