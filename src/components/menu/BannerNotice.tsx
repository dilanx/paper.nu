import { ExclamationCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Alert } from '@/types/AlertTypes';
import { BannerData } from '@/types/BaseTypes';

interface BannerNoticeProps {
  data: BannerData;
  alert: Alert;
  dismiss: () => void;
}

export default function BannerNotice({
  data,
  alert,
  dismiss,
}: BannerNoticeProps) {
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
            confirmButton: 'Dismiss',
            cancelButton: 'Cancel',
            textHTML: <>{data.content}</>,
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
