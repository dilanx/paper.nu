import {
    AlertConfirmationState,
    AlertDataOption,
} from '../../../types/AlertTypes';
import { UserOptions } from '../../../types/BaseTypes';

export const getAlertOptions = (
    options: AlertDataOption[] | undefined,
    switches: UserOptions,
    confirmation: AlertConfirmationState,
    setConfirmation: React.Dispatch<
        React.SetStateAction<AlertConfirmationState>
    >
) =>
    options?.map((option, i) => {
        let enabled = option.singleAction
            ? false
            : (switches.get[option.name] as boolean);
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
                    {!option.singleAction &&
                        (enabled ? (
                            <button
                                className="block mx-auto bg-emerald-400 text-white text-sm font-medium opacity-100 hover:opacity-60 transition-all duration-150
                            m-1 p-2 w-full rounded-md shadow-sm"
                                onClick={() => {
                                    switches.set(
                                        option.name,
                                        false,
                                        option.saveToStorage
                                    );
                                    if (option.bonusAction) {
                                        option.bonusAction(false);
                                    }
                                }}
                            >
                                {option.buttonTextOn ?? 'Enabled'}
                            </button>
                        ) : (
                            <button
                                className="block mx-auto bg-red-400 text-white text-sm font-medium opacity-100 hover:opacity-60 transition-all duration-150
                            m-1 p-2 w-full rounded-md shadow-sm"
                                onClick={() => {
                                    switches.set(
                                        option.name,
                                        true,
                                        option.saveToStorage
                                    );
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
                                confirmation[option.name]
                                    ? 'bg-red-500 dark:bg-red-500'
                                    : 'bg-gray-600 dark:bg-gray-500'
                            } text-white text-sm font-medium opacity-100 hover:opacity-60 transition-all duration-150
                            m-1 p-2 w-full rounded-md shadow-md'`}
                            onClick={() => {
                                if (option.requireConfirmation) {
                                    if (!confirmation[option.name]) {
                                        setConfirmation({
                                            ...confirmation,
                                            [option.name]: true,
                                        });
                                        return;
                                    }
                                }
                                if (option.singleAction) option.singleAction();
                                setConfirmation({
                                    ...confirmation,
                                    [option.name]: false,
                                });
                            }}
                        >
                            {confirmation[option.name]
                                ? 'Confirm'
                                : option.buttonTextOn ?? 'Go'}
                        </button>
                    )}
                </div>
            </div>
        );
    }) ?? [];
