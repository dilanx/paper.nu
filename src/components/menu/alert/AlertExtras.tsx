import { AlertData, AlertDataExtra } from '../../../types/AlertTypes';

export const getAlertExtras = (extras: AlertDataExtra[] | undefined) =>
    extras?.map((extra, i) => (
        <div className="mt-4" key={`alert-extra-${i}`}>
            <p className="text-xs text-gray-500 font-bold dark:text-gray-300">
                {extra.title}
            </p>
            <p className="m-0 p-0 text-sm text-gray-500 font-light dark:text-gray-300">
                {extra.content}
            </p>
        </div>
    )) ?? [];
