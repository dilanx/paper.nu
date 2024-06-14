import { ExclamationCircleIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { UserOptions } from '@/types/BaseTypes';
import { Alert } from '@/types/AlertTypes';

interface SearchBoxNoticeProps {
  id: string;
  alert: Alert;
  switches: UserOptions;
  children?: React.ReactNode;
}

export default function SearchBoxNotice({
  id,
  alert,
  switches,
  children,
}: SearchBoxNoticeProps) {
  const store = switches.get.notice_dismiss;
  if (store?.split(',').includes(id)) return <></>;

  return (
    <div className="m-2 rounded-lg border-2 border-purple-400 bg-purple-50 p-2 text-gray-600 dark:border-purple-300 dark:bg-gray-800 dark:text-gray-300">
      <div className="flex items-center gap-2 font-bold text-purple-400 dark:text-purple-300">
        <ExclamationCircleIcon className="h-5 w-5" />
        <p>NOTICE</p>
        <div className="flex flex-1 items-center justify-end">
          <button
            className="rounded-md p-1 hover:bg-purple-100 active:bg-purple-200 dark:hover:bg-gray-700 dark:active:bg-gray-600"
            onClick={() => {
              alert({
                color: 'purple',
                title: 'Dismiss this notice?',
                icon: ExclamationCircleIcon,
                confirmButton: 'Dismiss',
                cancelButton: 'Cancel',
                textHTML: <>{children}</>,
                action: () => {
                  const store = switches.get.notice_dismiss;
                  if (store) {
                    switches.set('notice_dismiss', store + ',' + id, true);
                  } else {
                    switches.set('notice_dismiss', id, true);
                  }
                },
              });
            }}
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
      <div className="px-2 text-xs">{children}</div>
    </div>
  );
}
