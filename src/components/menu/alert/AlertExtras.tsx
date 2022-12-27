import { AlertDataExtra } from '../../../types/AlertTypes';

export const getAlertExtras = (extras: AlertDataExtra[] | undefined) =>
  extras?.map((extra, i) => (
    <div className="mt-4" key={`alert-extra-${i}`}>
      <p className="text-xs font-bold text-gray-500 dark:text-gray-300">
        {extra.title}
      </p>
      <p className="m-0 p-0 text-sm font-light text-gray-500 dark:text-gray-300">
        {extra.content}
      </p>
    </div>
  )) ?? [];
