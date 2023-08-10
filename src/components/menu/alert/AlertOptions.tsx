import { Switch } from '@headlessui/react';
import { AlertData, AlertDataOption } from '../../../types/AlertTypes';
import { UserOptions } from '../../../types/BaseTypes';
import { Fragment } from 'react';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

export const getAlertOptions = (
  options: AlertDataOption[] | undefined,
  switches: UserOptions,
  next: (nextAlert: AlertData) => void
) =>
  options?.map((option, i) => {
    const single = !option.switch;
    const enabled = option.switch && (switches.get[option.switch] as boolean);

    const onClick = (newValue: boolean) => {
      switches.set(option.switch!, newValue, option.saveToStorage);
      if (option.action) {
        option.action(newValue, next);
      }
    };

    return (
      <Fragment key={`alert-option-${option.switch || i}`}>
        <div className="m-2 flex flex-col gap-2 p-2">
          <div className="flex items-center">
            <p
              className={`flex-1 text-sm text-black dark:text-white ${
                option.appearanceToggle
                  ? 'text-center font-medium'
                  : 'font-bold'
              }`}
            >
              {option.title}
            </p>
            {!option.appearanceToggle && (
              <div className="mx-2">
                {single ? (
                  <button
                    className="flex h-7 w-12 items-center justify-center rounded-lg border border-gray-500 bg-gray-600 text-white shadow-sm hover:bg-gray-500 active:bg-gray-400"
                    onClick={() => {
                      if (option.action) {
                        option.action(false, next);
                      }
                    }}
                  >
                    <ArrowRightIcon className="h-5 w-5" />
                  </button>
                ) : (
                  <Switch
                    checked={enabled}
                    onChange={() => onClick(!enabled)}
                    className={`${
                      enabled
                        ? 'bg-emerald-400 hover:bg-emerald-500 active:bg-emerald-600'
                        : 'bg-gray-600 hover:bg-gray-500 active:bg-gray-400'
                    }
              relative inline-flex h-7 w-12 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
                  >
                    <span
                      aria-hidden="true"
                      className={`${enabled ? 'translate-x-5' : 'translate-x-0'}
        pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                    />
                  </Switch>
                )}
              </div>
            )}
          </div>
          {option.appearanceToggle && (
            <div className="flex gap-4 px-4">
              <button
                className={`flex-1 rounded-md border-2 bg-white p-1 text-black opacity-100 shadow-md ${
                  !enabled
                    ? 'border-orange-400'
                    : 'border-gray-700 hover:border-orange-300 active:border-orange-300 active:opacity-80'
                }`}
                onClick={() => onClick(false)}
              >
                Light
              </button>
              <button
                className={`flex-1 rounded-md border-2 bg-gray-800 p-1 text-white opacity-100 shadow-md ${
                  enabled
                    ? 'border-orange-400'
                    : 'border-white hover:border-orange-300 active:border-orange-300 active:opacity-80'
                }`}
                onClick={() => onClick(true)}
              >
                Dark
              </button>
            </div>
          )}
          {option.description && (
            <p className="mr-2 text-xs text-gray-600 dark:text-gray-300">
              {option.description}
            </p>
          )}
        </div>
        {i !== options.length - 1 && (
          <hr className="mx-4 my-1 dark:border-gray-600" />
        )}
      </Fragment>
    );
  }) ?? [];
