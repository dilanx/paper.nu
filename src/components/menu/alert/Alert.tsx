import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useEffect, useRef, useState } from 'react';
import {
  AlertConfirmationState,
  AlertData,
  AlertFormResponse,
} from '../../../types/AlertTypes';
import { UserOptions } from '../../../types/BaseTypes';
import { formIsValid } from '../../../utility/AlertFormInputValidation';
import { TabBar, TabBarButton } from '../TabBar';
import { getAlertEditButtons } from './AlertEditButtons';
import { getAlertExtras } from './AlertExtras';
import { getAlertForm } from './AlertForm';
import { getAlertOptions } from './AlertOptions';

interface AlertProps {
  data: AlertData;
  switches: UserOptions;
  onConfirm: (inputText?: string) => void;
  onClose: () => void;
}

export default function Alert(props: AlertProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [confirmation, setConfirmation] = useState<AlertConfirmationState>({});
  const [inputText, setInputText] = useState('');
  const [badInput, setBadInput] = useState(false);

  const data = props.data;

  useEffect(() => {
    if (data.textInput?.match) {
      setBadInput(!data.textInput.match.test(inputText));
    }
  }, [data.textInput, inputText]);

  let defaultFormValues: AlertFormResponse = {};
  if (data.form) {
    for (const section of data.form.sections) {
      for (const field of section.fields) {
        defaultFormValues[field.name] = field.defaultValue || '';
      }
    }
  }

  const [formValues, setFormValues] =
    useState<AlertFormResponse>(defaultFormValues);

  useEffect(() => {
    if (data.form) {
      setBadInput(!formIsValid(formValues, data.form.sections));
    }
  }, [data.form, formValues]);

  const initialFocus = useRef(null);
  const confirmButton = useRef(null);

  function close() {
    setIsOpen(false);
  }

  function confirm() {
    setIsOpen(false);
    props.onConfirm(props.data.textInput ? inputText : undefined);
  }

  const extraList = getAlertExtras(data.extras);

  let options = data.options;

  let tabBar: JSX.Element | undefined = undefined;

  if (data.tabs) {
    let tabs = data.tabs;
    let selected = props.switches.get[tabs.switchName] as string;
    tabBar = (
      <TabBar
        switches={props.switches}
        switchName={tabs.switchName}
        tabLoading={false}
        colorMap={tabs.colorMap}
      >
        {tabs.tabs.map((tab) => {
          if (tab.name === selected) {
            options = tab.options;
          }
          return (
            <TabBarButton
              name={tab.name}
              selected={selected}
              switches={props.switches}
              switchName={tabs.switchName}
              color={tabs.colorMap[tab.name]}
              disableClick={tab.disableClick}
              tooltipBelow={true}
              key={`alert-tab-${tab.name}`}
            >
              {tab.display}
            </TabBarButton>
          );
        })}
      </TabBar>
    );
  }

  let optionList = getAlertOptions(
    options,
    props.switches,
    confirmation,
    setConfirmation
  );

  let editButtonList = getAlertEditButtons(data.editButtons, close);

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        initialFocus={initialFocus}
        className={`${props.switches.get.dark ? 'dark' : ''} relative z-40`}
        onClose={() => close()}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          afterLeave={() => props.onClose()}
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full dark:bg-gray-700">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 dark:bg-gray-700">
                  <div className="sm:flex sm:items-start">
                    <div
                      ref={initialFocus}
                      className={`mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-${data.iconColor}-100 dark:bg-gray-600 sm:mx-0 sm:h-10 sm:w-10`}
                    >
                      <data.icon
                        className={`w-6 h-6 text-${data.iconColor}-600 dark:text-${data.iconColor}-300`}
                        aria-hidden="true"
                      />
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <Dialog.Title
                        as="h3"
                        className="text-lg leading-6 font-medium text-black dark:text-white"
                      >
                        {data.title}
                      </Dialog.Title>

                      {data.subtitle && (
                        <div>
                          <p className="text-md font-light text-gray-900 dark:text-gray-50">
                            {data.subtitle}
                          </p>
                        </div>
                      )}
                      {data.customSubtitle && <div>{data.customSubtitle}</div>}
                      {(data.message || data.textHTML) && (
                        <div className="alert-data mt-2 text-sm text-gray-600 dark:text-gray-100">
                          {data.message && <p>{data.message}</p>}
                          {data.textHTML}
                        </div>
                      )}
                      {extraList.length > 0 && extraList}
                      {data.textInput && (
                        <div>
                          <input
                            ref={
                              data.textInput.focusByDefault
                                ? initialFocus
                                : undefined
                            }
                            type="text"
                            className={`bg-gray-200 dark:bg-gray-800 text-black dark:text-white
                                                mt-4 p-1 px-4 font-mono text-sm rounded-md md:w-96 overflow-scroll whitespace-nowrap overscroll-contain no-scrollbar 
                                                outline-none border-2 border-gray-200 hover:border-gray-400 dark:border-gray-800 dark:hover:border-gray-500 
                                                transition-all duration-150 
                                                ${
                                                  inputText.length === 0 ||
                                                  !data.textInput.match
                                                    ? 'focus:border-gray-500 focus:active:border-gray-300'
                                                    : badInput
                                                    ? 'focus:border-green-500 focus:active:border-green-500'
                                                    : 'focus:border-red-500 focus:active:border-red-500'
                                                }`}
                            placeholder={data.textInput.placeholder}
                            onChange={(event) => {
                              setInputText(event.target.value);
                            }}
                          />
                          <p className="text-sm text-red-500 mx-2 my-1">
                            {!badInput &&
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

                {data.form && (
                  <div className="m-4 sm:grid sm:grid-cols-2 sm:gap-2">
                    {getAlertForm(
                      formValues,
                      (name, value) => {
                        setFormValues({ ...formValues, [name]: value });
                      },
                      data.form.sections
                    )}
                  </div>
                )}

                {(editButtonList.length > 0 || tabBar) && (
                  <div className="absolute top-4 right-5 flex flex-row gap-1">
                    {tabBar}
                    {editButtonList.length > 0 && editButtonList}
                  </div>
                )}

                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse dark:bg-gray-800">
                  {data.confirmButton && (
                    <button
                      type="button"
                      ref={confirmButton}
                      className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 
                        bg-${data.confirmButtonColor}-500
                        opacity-100 hover:bg-${data.confirmButtonColor}-600 active:bg-${data.confirmButtonColor}-700
                        disabled:opacity-30 disabled:cursor-not-allowed
                        text-base font-medium text-white outline-none sm:ml-3 sm:w-auto sm:text-sm`}
                      disabled={badInput}
                      onClick={() => {
                        if (data.form) {
                          data.form.onSubmit(formValues);
                        }
                        confirm();
                      }}
                    >
                      {data.confirmButton}
                    </button>
                  )}
                  {data.cancelButton && (
                    <button
                      type="button"
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2
                                bg-white text-base font-medium text-gray-700 hover:bg-gray-100 active:bg-gray-200 active:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm
                                dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600 dark:active:bg-gray-500"
                      onClick={() => {
                        close();
                      }}
                    >
                      {data.cancelButton}
                    </button>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
