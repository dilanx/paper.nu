import { useApp } from '@/app/Context';
import { BannerData } from '@/types/BaseTypes';
import { ExclamationCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface BannerNoticeProps {
  data: BannerData;
  dismiss: () => void;
}

export default function BannerNotice({ data, dismiss }: BannerNoticeProps) {
  const { alert } = useApp();
  return (
    <div
      className={`background-gradient-${
        data.gradient
      } relative z-50 flex w-full items-center justify-center text-center font-medium shadow-sm md:h-8 ${
        data.theme === 'light' ? 'text-gray-700' : 'text-white'
      }`}
    >
      <p className="px-8 py-2 text-sm md:py-0">{data.content}</p>
      <button
        className="absolute right-1 top-1/2 -translate-y-1/2"
        title="Dismiss"
        onClick={() => {
          alert({
            color: 'purple',
            title: 'Dismiss this banner notice?',
            icon: ExclamationCircleIcon,
            message:
              'This specific banner notice will not be shown on this device again.',
            confirmButton: 'Dismiss',
            cancelButton: 'Cancel',
            textHTML: (
              <div
                className={`my-2 rounded-md p-1 ${
                  data.theme === 'light'
                    ? 'bg-gray-100 text-gray-700'
                    : 'bg-gray-600 text-white'
                } shadow-sm`}
              >
                {data.content}
              </div>
            ),
            action: () => {
              dismiss();
            },
          });
        }}
      >
        <XMarkIcon
          className={`h-5 w-5 rounded-sm stroke-2 opacity-60 ${
            data.theme === 'light'
              ? 'text-gray-800 hover:bg-gray-400/50 active:bg-gray-400/30'
              : 'text-white hover:bg-gray-300/50 active:bg-gray-300/30'
          }`}
        />
      </button>
    </div>
  );
}
