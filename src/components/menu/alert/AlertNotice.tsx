import { AlertNotice } from '@/types/AlertTypes';
import {
  InformationCircleIcon,
  LightBulbIcon,
} from '@heroicons/react/24/outline';

const NOTICE_TYPES = {
  note: {
    color: 'amber',
    Icon: InformationCircleIcon,
    title: 'NOTE',
  },
  tip: {
    color: 'green',
    Icon: LightBulbIcon,
    title: 'TIP',
  },
};

export const getAlertNotice = (notice: AlertNotice) => {
  const { type, message } = notice;
  const { color, Icon, title } = NOTICE_TYPES[type];

  return (
    <div
      className={`my-2 rounded-md border-l-4 border-${color}-500 bg-${color}-100 px-3 py-2 dark:border-${color}-400 dark:bg-${color}-600 dark:bg-opacity-25`}
    >
      <div
        className={`my-1 flex items-center gap-1 text-sm font-bold text-${color}-600 dark:text-${color}-300`}
      >
        <Icon className="h-4 w-4 stroke-2" />
        <p>{title}</p>
      </div>
      <p className={`text-sm text-${color}-600 dark:text-${color}-300 my-1`}>
        {message}
      </p>
    </div>
  );
};
