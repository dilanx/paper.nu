import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useEffect, useRef, useState } from 'react';
import { SpinnerCircularFixed } from 'spinners-react';
import {
  AlertActionData,
  AlertData,
  AlertFormResponse,
  AlertNextFn,
} from '../../../types/AlertTypes';
import { UserOptions } from '../../../types/BaseTypes';
import { formIsValid } from '../../../utility/AlertFormInputValidation';
import ScrollSelectMenu from '../../generic/ScrollSelectMenu';
import { TabButton, Tabs } from '../Tabs';
import { getAlertEditButtons } from './AlertEditButtons';
import { getAlertExtras } from './AlertExtras';
import { getAlertForm } from './AlertForm';
import { getAlertNotice } from './AlertNotice';
import { getAlertOptions } from './AlertOptions';

interface AlertProps {
  data: AlertData;
  switches: UserOptions;
  onConfirm: (data: AlertActionData) => void;
  onSwitch: AlertNextFn;
  onClose: () => void;
}

type TextViewStatus = 'none' | 'loading' | 'updated' | 'error';

export default function Alert({
  data,
  switches,
  onConfirm,
  onSwitch,
  onClose,
}: AlertProps) {
  const darkMode = switches.get.dark;
  const [isOpen, setIsOpen] = useState(true);
  const [textValue, setTextValue] = useState<string | undefined>(
    data.selectMenu?.defaultValue || data.textInput?.defaultValue
  );
  const [[textViewData, textViewStatus], setTextViewData] = useState<
    [string | undefined, TextViewStatus]
  >([data.textView?.text, 'none']);
  const [badInput, setBadInput] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (data.textInput?.match) {
      setBadInput(!data.textInput.match.test(textValue ?? ''));
    }
  }, [data.textInput, textValue]);

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

  const [context, setContext] = useState(data.custom?.initialContext || {});

  useEffect(() => {
    const [valid, error] = data.form
      ? formIsValid(formValues, data.form)
      : [true, null];
    if (!valid) {
      setBadInput(true);
      setErrorMessage(error);
    } else if (context.error) {
      setBadInput(true);
      setErrorMessage(context.error);
    } else {
      setBadInput(false);
      setErrorMessage(null);
    }
  }, [data.form, formValues, context.error]);

  const initialFocus = useRef(null);
  const confirmButton = useRef(null);

  function close() {
    setIsOpen(false);
  }

  function confirm() {
    setIsOpen(false);
    onConfirm({ inputText: textValue, textViewValue: textViewData, context });
  }

  const extraList = getAlertExtras(data.extras);

  let options = data.options;

  let tabBar: JSX.Element | undefined = undefined;

  if (data.tabs) {
    let tabs = data.tabs;
    let selected = switches.get[tabs.switchName] as string;
    tabBar = (
      <Tabs
        switches={switches}
        switchName={tabs.switchName}
        tabLoading={false}
        colorMap={tabs.colorMap}
      >
        {tabs.tabs.map((tab) => {
          if (tab.name === selected) {
            options = tab.options;
          }
          return (
            <TabButton
              name={tab.name}
              selected={selected}
              switches={switches}
              switchName={tabs.switchName}
              color={tabs.colorMap[tab.name]}
              disableClick={tab.disableClick}
              tooltipBelow={true}
              key={`alert-tab-${tab.name}`}
            >
              {tab.display}
            </TabButton>
          );
        })}
      </Tabs>
    );
  }

  let optionList = getAlertOptions(options, switches, onSwitch);

  let editButtonList = getAlertEditButtons(data.editButtons, close);

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        initialFocus={initialFocus}
        className={`${darkMode ? 'dark' : ''} relative z-40`}
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
          afterLeave={() => onClose()}
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
              <Dialog.Panel className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all dark:bg-gray-700 sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
                <div className="bg-white px-4 pb-4 pt-5 dark:bg-gray-700 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div
                      ref={initialFocus}
                      className={`mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-${data.color}-100 dark:bg-gray-600 sm:mx-0 sm:h-10 sm:w-10`}
                    >
                      <data.icon
                        className={`h-6 w-6 text-${data.color}-600 dark:text-${data.color}-300`}
                        aria-hidden="true"
                      />
                    </div>
                    <div className="mt-3 flex-1 text-center sm:ml-4 sm:mt-0 sm:text-left">
                      <Dialog.Title
                        as="h3"
                        className="text-lg font-medium leading-6 text-black dark:text-white"
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
                            className={`no-scrollbar mt-4 overflow-scroll overscroll-contain
                                                whitespace-nowrap rounded-md border-2 border-gray-200 bg-gray-200 p-1 px-4 font-mono text-sm text-black outline-none 
                                                transition-all duration-150 hover:border-gray-400 dark:border-gray-800 dark:bg-gray-800 dark:text-white 
                                                dark:hover:border-gray-500 md:w-96 
                                                ${
                                                  !textValue ||
                                                  textValue.length === 0 ||
                                                  !data.textInput.match
                                                    ? 'focus:border-gray-500 dark:focus:border-gray-500'
                                                    : badInput
                                                    ? 'focus:border-red-500 dark:focus:border-red-500'
                                                    : 'focus:border-green-500 dark:focus:border-green-500'
                                                }`}
                            placeholder={data.textInput.placeholder}
                            defaultValue={data.textInput.defaultValue}
                            onChange={(event) => {
                              setTextValue(event.target.value);
                            }}
                            onKeyUp={(event) => {
                              if (event.key === 'Enter') {
                                if (
                                  badInput ||
                                  data.disableConfirmButton !== undefined
                                ) {
                                  return;
                                }
                                confirm();
                              }
                            }}
                          />
                          <p className="mx-2 my-1 text-sm text-red-500">
                            {badInput &&
                              textValue &&
                              textValue.length > 0 &&
                              data.textInput.matchError}
                          </p>
                        </div>
                      )}
                      {data.textView && (
                        <div>
                          <p
                            className="no-scrollbar mt-4 overflow-scroll overscroll-contain
                                            whitespace-nowrap rounded-md bg-gray-200 p-1 px-4 font-mono text-sm text-black dark:bg-gray-800
                                            dark:text-white md:w-96"
                          >
                            {textViewData}
                          </p>
                          {data.textView.update && (
                            <div className="mt-2 flex justify-end md:w-96">
                              <button
                                disabled={
                                  data.textView.update.disabled ||
                                  textViewStatus !== 'none'
                                }
                                className="relative rounded-md border border-gray-300 bg-white px-4 py-0.5 text-sm
                                font-bold text-gray-700 shadow-sm hover:bg-gray-100 active:bg-gray-200
                                active:outline-none disabled:bg-gray-50 disabled:text-gray-400 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-600 dark:active:bg-gray-500
                                dark:disabled:bg-gray-800 dark:disabled:text-gray-600"
                                onClick={() => {
                                  if (
                                    !data.textView?.update ||
                                    textViewStatus !== 'none'
                                  ) {
                                    return;
                                  }
                                  setTextViewData([textViewData, 'loading']);
                                  data.textView.update
                                    .fn()
                                    .then((val) => {
                                      setTextViewData([
                                        val,
                                        data.textView?.update?.afterUpdate
                                          ? 'updated'
                                          : 'none',
                                      ]);
                                    })
                                    .catch((err) => {
                                      setTextViewData([
                                        `Something went wrong: ${err.message}`,
                                        'error',
                                      ]);
                                    });
                                }}
                              >
                                <p className="tracking-wide">
                                  {textViewStatus === 'updated'
                                    ? data.textView.update.afterUpdate || 'Done'
                                    : textViewStatus === 'error'
                                    ? 'ERROR'
                                    : data.textView.update.text}
                                </p>
                                {textViewStatus === 'loading' && (
                                  <SpinnerCircularFixed
                                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                                    size={20}
                                    thickness={160}
                                    speed={200}
                                    color={
                                      darkMode
                                        ? 'rgb(212, 212, 212)'
                                        : 'rgb(115, 115, 115)'
                                    }
                                    secondaryColor={
                                      darkMode
                                        ? 'rgb(64, 64, 64)'
                                        : 'rgba(245, 245, 245)'
                                    }
                                  />
                                )}
                              </button>
                            </div>
                          )}
                        </div>
                      )}

                      {data.selectMenu && (
                        // <SelectMenuLegacy
                        //   options={data.selectMenu.options}
                        //   value={textValue}
                        //   setValue={(value) => setTextValue(value)}
                        //   color={data.color}
                        // />
                        // <SelectMenu />
                        <div className="my-2 flex gap-4">
                          <ScrollSelectMenu
                            className="flex-1"
                            options={[
                              { value: '1' },
                              { value: '2' },
                              { value: '3' },
                            ]}
                            selectedValue={'3'}
                            setSelectedValue={() => {}}
                          />
                          {/* <ScrollSelectMenu className="flex-1" /> */}
                        </div>
                      )}
                      {data.notice && getAlertNotice(data.notice)}
                      {data.disableConfirmButton && (
                        <p className="text-right text-sm font-bold text-red-500 dark:text-red-400">
                          {data.disableConfirmButton}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {data.custom && (
                  <div className="px-8 py-4">
                    {data.custom.content(context, (c) => setContext(c))}
                  </div>
                )}

                {optionList.length > 0 && optionList}

                {data.form && (
                  <div className="m-4 sm:grid sm:grid-cols-4 sm:gap-2">
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
                  <div className="absolute right-5 top-4 flex flex-row gap-1">
                    {tabBar}
                    {editButtonList.length > 0 && editButtonList}
                  </div>
                )}

                <div className="bg-gray-50 px-4 py-1 dark:bg-gray-800 sm:px-6">
                  {errorMessage && (
                    <p className="text-right text-xs font-medium text-red-500">
                      {errorMessage}
                    </p>
                  )}
                  <div className="py-2 sm:flex sm:flex-row-reverse">
                    {data.confirmButton && (
                      <button
                        type="button"
                        ref={confirmButton}
                        className={`inline-flex w-full justify-center rounded-md border border-transparent px-4 py-2 shadow-sm 
                        bg-${data.color}-500
                        opacity-100 hover:bg-${data.color}-600 active:bg-${data.color}-700
                        text-base font-medium
                        text-white outline-none disabled:cursor-not-allowed disabled:opacity-30 sm:ml-3 sm:w-auto sm:text-sm`}
                        disabled={
                          badInput || data.disableConfirmButton !== undefined
                        }
                        onClick={() => {
                          if (data.form) {
                            data.form.onSubmit(formValues, context, onSwitch);
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
                        className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2
                                text-base font-medium text-gray-700 shadow-sm hover:bg-gray-100 active:bg-gray-200 active:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600
                                dark:active:bg-gray-500 sm:ml-3 sm:mt-0 sm:w-auto sm:text-sm"
                        onClick={() => {
                          close();
                        }}
                      >
                        {data.cancelButton}
                      </button>
                    )}
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
