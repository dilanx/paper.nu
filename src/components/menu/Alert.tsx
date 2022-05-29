import { useState, useRef } from 'react';
import { Dialog } from '@headlessui/react';
import {
    AlertData,
    AlertDataEditButtonData,
    editButtonIsToggleable,
} from '../../types/AlertTypes';
import { UserOptions } from '../../types/BaseTypes';

interface AlertProps {
    data: AlertData;
    switches: UserOptions;
    onConfirm: (inputText?: string) => void;
    onClose: () => void;
}

interface AlertConfirmationState {
    [key: string]: boolean;
}

export default function Alert(props: AlertProps) {
    let [isOpen, setIsOpen] = useState(true);
    let [confirmation, setConfirmation] = useState<AlertConfirmationState>({});
    let [inputText, setInputText] = useState('');

    let dontAutoFocusButton = useRef(null);

    function close() {
        setIsOpen(false);
        props.onClose();
    }

    function confirm() {
        setIsOpen(false);
        props.onConfirm(props.data.textInput ? inputText : undefined);
    }

    let data = props.data;

    let extraList: JSX.Element[] = [];
    if (data.extras) {
        let i = 0;
        data.extras.forEach(extra => {
            extraList.push(
                <div className="mt-4" key={`alert-extra-${i}`}>
                    <p className="text-xs text-gray-500 font-bold dark:text-gray-400">
                        {extra.title}
                    </p>
                    <p className="m-0 p-0 text-sm text-gray-500 font-light dark:text-gray-400">
                        {extra.content}
                    </p>
                </div>
            );
            i++;
        });
    }

    let optionList: JSX.Element[] = [];

    if (data.options) {
        let i = 0;
        data.options.forEach(option => {
            let enabled = false;
            if (!option.singleAction)
                enabled = props.switches.get[option.name] as boolean;
            optionList.push(
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
                                    m-1 p-2 w-full rounded-md shadow-md"
                                    onClick={() => {
                                        props.switches.set(
                                            option.name,
                                            false,
                                            option.saveToStorage
                                        );
                                        if (option.bonusAction) {
                                            option.bonusAction(false);
                                        }
                                    }}
                                >
                                    {option.buttonTextOn}
                                </button>
                            ) : (
                                <button
                                    className="block mx-auto bg-red-400 text-white text-sm font-medium opacity-100 hover:opacity-60 transition-all duration-150
                                    m-1 p-2 w-full rounded-md shadow-md"
                                    onClick={() => {
                                        props.switches.set(
                                            option.name,
                                            true,
                                            option.saveToStorage
                                        );
                                        if (option.bonusAction) {
                                            option.bonusAction(true);
                                        }
                                    }}
                                >
                                    {option.buttonTextOff}
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
                                    if (option.singleAction)
                                        option.singleAction();
                                    setConfirmation({
                                        ...confirmation,
                                        [option.name]: false,
                                    });
                                }}
                            >
                                {confirmation[option.name]
                                    ? 'Confirm'
                                    : option.buttonTextOn}
                            </button>
                        )}
                    </div>
                </div>
            );
            i++;
        });
    }

    let editButtonList: JSX.Element[] = [];

    if (data.editButtons) {
        let i = 0;
        data.editButtons.forEach(editButton => {
            let dataSet: AlertDataEditButtonData;

            if (editButtonIsToggleable(editButton)) {
                dataSet = editButton.data.has(editButton.key)
                    ? editButton.enabled
                    : editButton.disabled;
            } else {
                dataSet = editButton.buttonData;
            }

            editButtonList.push(
                <button
                    className={`text-gray-500 hover:text-${dataSet.color}-400 transition-all duration-150`}
                    key={`edit-button-${i}`}
                    title={dataSet.title}
                    onClick={() => {
                        dataSet.action();
                        if (dataSet.close) close();
                    }}
                >
                    {dataSet.icon}
                </button>
            );
            i++;
        });
    }

    let okay = true;

    if (data.textInput?.match) {
        okay = data.textInput.match.test(inputText);
    }

    return (
        <Dialog
            open={isOpen}
            onClose={() => {
                close();
            }}
            initialFocus={dontAutoFocusButton}
            className={`${
                props.switches.get.dark ? 'dark' : ''
            } fixed z-10 inset-0 overflow-y-auto`}
        >
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <span
                    className="hidden sm:inline-block sm:align-middle sm:h-screen"
                    aria-hidden="true"
                >
                    &#8203;
                </span>
                <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full dark:bg-gray-700">
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 dark:bg-gray-700">
                        <div className="sm:flex sm:items-start">
                            <div
                                ref={dontAutoFocusButton}
                                className={`mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-${data.iconBackgroundColor}-100 sm:mx-0 sm:h-10 sm:w-10`}
                            >
                                {data.icon}
                            </div>
                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                <Dialog.Title
                                    as="h3"
                                    className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100"
                                >
                                    {data.title}
                                </Dialog.Title>

                                {data.subtitle && (
                                    <div>
                                        <p className="text-md font-light text-gray-900 dark:text-gray-100">
                                            {data.subtitle}
                                        </p>
                                    </div>
                                )}
                                {data.customSubtitle && (
                                    <div>{data.customSubtitle}</div>
                                )}
                                <div className="mt-2">
                                    <p className="text-sm text-gray-500 dark:text-gray-200">
                                        {data.message}
                                    </p>
                                </div>
                                {extraList.length > 0 && extraList}
                                {data.textInput && (
                                    <div>
                                        <input
                                            type="text"
                                            className={`bg-gray-200 dark:bg-gray-800 text-black dark:text-white
                                                mt-4 p-1 px-4 font-mono text-sm rounded-md md:w-96 overflow-scroll whitespace-nowrap overscroll-contain no-scrollbar 
                                                outline-none border-2 border-gray-200 hover:border-gray-400 transition-all duration-150 
                                                ${
                                                    inputText.length === 0 ||
                                                    !data.textInput.match
                                                        ? 'focus:border-gray-500'
                                                        : okay
                                                        ? 'focus:border-green-500'
                                                        : 'focus:border-red-500'
                                                }`}
                                            placeholder={
                                                data.textInput.placeholder
                                            }
                                            onChange={event => {
                                                setInputText(
                                                    event.target.value
                                                );
                                            }}
                                        />
                                        <p className="text-sm text-red-500 mx-2 my-1">
                                            {!okay &&
                                                inputText.length > 0 &&
                                                data.textInput.matchError}
                                        </p>
                                    </div>
                                )}
                                {data.textView && (
                                    <div>
                                        <p
                                            className="bg-gray-200 dark:bg-gray-800 text-black dark:text-white
                                            mt-4 p-1 px-4 font-mono text-sm rounded-md md:w-96 overflow-scroll whitespace-nowrap
                                            overscroll-contain no-scrollbar"
                                        >
                                            {data.textView}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {optionList.length > 0 && optionList}

                    {editButtonList.length > 0 && (
                        <div className="absolute top-3 right-3 flex flex-row gap-1">
                            {editButtonList}
                        </div>
                    )}

                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse dark:bg-gray-800">
                        <button
                            type="button"
                            className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 
                                ${
                                    okay
                                        ? `bg-${data.confirmButtonColor}-500 hover:bg-${data.confirmButtonColor}-600 focus:bg-${data.confirmButtonColor}-700`
                                        : `bg-${data.confirmButtonColor}-300 cursor-not-allowed`
                                } 
                                 text-base font-medium text-white focus:outline-none sm:ml-3 sm:w-auto sm:text-sm 
                                 transition-all duration-150`}
                            disabled={!okay}
                            onClick={() => {
                                confirm();
                            }}
                        >
                            {data.confirmButton}
                        </button>
                        {data.cancelButton && (
                            <button
                                type="button"
                                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2
                                bg-white text-base font-medium text-gray-700 hover:bg-gray-100 focus:bg-gray-200 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm
                                dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600 dark:focus:bg-gray-500"
                                onClick={() => {
                                    close();
                                }}
                            >
                                {data.cancelButton}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </Dialog>
    );
}
