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
      className={`background-gradient-${data.gradient} relative z-50 flex w-full items-center justify-center text-center font-bold text-white shadow-sm md:h-8`}
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
              <div className="my-2 rounded-md bg-gray-100 p-1 shadow-sm dark:bg-gray-600">
                {data.content}
              </div>
            ),
            action: () => {
              dismiss();
            },
          });
        }}
      >
        <XMarkIcon className="h-5 w-5 rounded-sm stroke-2 text-white opacity-60 hover:bg-gray-300/50 active:bg-gray-300/30" />
      </button>
    </div>
  );
}
