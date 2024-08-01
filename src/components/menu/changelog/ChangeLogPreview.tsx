import paperBlack from '@/assets/paper-full-black.png';
import paperWhite from '@/assets/paper-full-white.png';
import toast, { Toast } from 'react-hot-toast';

interface ChangeLogPreviewProps {
  version: string;
  toast: Toast;
  dark?: boolean;
  onDismiss: () => void;
}

export default function ChangeLogPreview({
  version,
  toast: t,
  dark,
  onDismiss,
}: ChangeLogPreviewProps) {
  return (
    <div
      className={`rainbow-border h-32 w-72 text-black dark:text-white ${
        t.visible ? 'animate-toast-enter' : 'animate-toast-exit'
      }`}
    >
      <div className="flex h-full w-full flex-col justify-center rounded-xl bg-white p-2 dark:bg-gray-700">
        <img
          src={dark ? paperWhite : paperBlack}
          alt="paper.nu"
          className="w-32"
        />
        <p className="font-medium tracking-wide">
          Paper was updated to <span className="font-bold">v{version}</span>!
        </p>
        <div className="flex flex-1 items-end justify-end gap-2">
          <button
            className="rounded-md bg-black px-4 py-[0.1875rem] text-sm text-white hover:bg-gray-700 active:bg-gray-600 dark:bg-white dark:text-black dark:hover:bg-gray-200 dark:active:bg-gray-300"
            onClick={() => {
              window.open('https://dil.sh/paper-release-notes', '_blank');
            }}
          >
            What's New
          </button>
          <button
            className="rounded-md border border-gray-300 bg-white px-4 py-0.5 text-sm text-gray-600 shadow-sm hover:bg-gray-100 active:bg-gray-200 dark:border-gray-500 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:active:bg-gray-600"
            onClick={() => {
              toast.dismiss(t.id);
              onDismiss();
            }}
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
