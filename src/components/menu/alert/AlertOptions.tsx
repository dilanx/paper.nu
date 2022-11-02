import {
  AlertConfirmationState,
  AlertDataOption,
} from '../../../types/AlertTypes';
import { UserOptions } from '../../../types/BaseTypes';

export const getAlertOptions = (
  options: AlertDataOption[] | undefined,
  switches: UserOptions,
  confirmation: AlertConfirmationState,
  setConfirmation: React.Dispatch<React.SetStateAction<AlertConfirmationState>>
) =>
  options?.map((option, i) => {
    const singleAction = option.singleAction || !option.switch;
    let enabled =
      option.singleAction || !option.switch
        ? false
        : (switches.get[option.switch] as boolean);
    return (
      <div
        className="grid grid-cols-1 sm:grid-cols-5 p-2 m-2"
        key={`alert-option-${i}`}
      >
        <div className="col-span-1 sm:col-span-3">
          <p className="text-sm font-bold text-black dark:text-white">
            {option.title}
          </p>
          <p className="text-xs text-gray-600 mr-2 dark:text-gray-300">
            {option.description}
          </p>
        </div>
        <div className="col-span-1 sm:col-span-2">
          {!singleAction &&
            (enabled ? (
              <button
                className="block mx-auto bg-emerald-400 text-white text-sm font-medium opacity-100 hover:opacity-75 active:opacity-60 m-1 p-2 w-full rounded-md shadow-sm transition-all duration-150"
                onClick={() => {
                  switches.set(option.switch!, false, option.saveToStorage);
                  if (option.bonusAction) {
                    option.bonusAction(false);
                  }
                }}
              >
                {option.buttonTextOn ?? 'Enabled'}
              </button>
            ) : (
              <button
                className="block mx-auto bg-red-400 text-white text-sm font-medium opacity-100 hover:opacity-75 active:opacity-60 m-1 p-2 w-full rounded-md shadow-sm transition-all duration-150"
                onClick={() => {
                  switches.set(option.switch!, true, option.saveToStorage);
                  if (option.bonusAction) {
                    option.bonusAction(true);
                  }
                }}
              >
                {option.buttonTextOff ?? 'Disabled'}
              </button>
            ))}
          {option.singleAction && (
            <button
              className={`block mx-auto ${
                option.confirmation && confirmation[option.confirmation]
                  ? 'bg-red-500 dark:bg-red-500'
                  : 'bg-gray-600 dark:bg-gray-500'
              } text-white text-sm font-medium opacity-100 hover:opacity-75 active:opacity-60
                m-1 p-2 w-full rounded-md shadow-md transition-all duration-150'`}
              onClick={() => {
                if (option.confirmation) {
                  if (!confirmation[option.confirmation]) {
                    setConfirmation({
                      ...confirmation,
                      [option.confirmation]: true,
                    });
                    return;
                  }
                }
                if (option.singleAction) option.singleAction();
                if (option.confirmation) {
                  setConfirmation({
                    ...confirmation,
                    [option.confirmation]: false,
                  });
                }
              }}
            >
              {option.confirmation && confirmation[option.confirmation]
                ? 'Confirm'
                : option.buttonTextOn ?? 'Go'}
            </button>
          )}
        </div>
      </div>
    );
  }) ?? [];
