import { Color, ColorMap, IconElement, ReadUserOptions } from './BaseTypes';

export type AlertNextFn = (nextAlert: AlertData) => void;

export interface AlertDataExtra {
  title: string;
  content: string;
}

export interface AlertDataOption {
  switch?: keyof ReadUserOptions;
  title: string;
  description?: string;
  saveToStorage?: boolean;
  action?: (newSwitch: boolean, next: AlertNextFn) => void;
  appearanceToggle?: boolean;
}

export interface AlertConfirmationState {
  [key: string]: boolean;
}

export interface AlertDataTab {
  name: string;
  display: JSX.Element;
  disableClick?: boolean;
  options?: AlertDataOption[];
}

export interface AlertDataEditButtonData {
  title: string;
  icon: JSX.Element;
  color: Color;
  action: () => void;
  close?: boolean;
}

export type AlertDataEditButton =
  | ToggleableAlertDataEditButton<any>
  | NontoggleableAlertDataEditButton;

export interface NontoggleableAlertDataEditButton {
  toggle: false;
  buttonData: AlertDataEditButtonData;
}

export interface ToggleableAlertDataEditButton<T> {
  toggle: true;
  data: Set<T> | T[];
  key: T;
  indexProperty?: keyof T;
  enabled: AlertDataEditButtonData;
  disabled: AlertDataEditButtonData;
}

export function editButtonIsToggleable(
  button: AlertDataEditButton
): button is ToggleableAlertDataEditButton<any> {
  return button.toggle;
}

export interface AlertFormSection {
  title?: string;
  description?: string;
  totalRowItems?: 1 | 2 | 4;
  fields: AlertFormField[];
}

type AlertFormFieldType =
  | 'text'
  | 'date'
  | 'time'
  | 'single-select'
  | 'multi-select'
  | 'color-select';

export interface AlertFormField {
  name: string;
  type: AlertFormFieldType;
  defaultValue?: string;
  required?: boolean;
}

export interface AlertFormFieldText extends AlertFormField {
  type: 'text';
  placeholder?: string;
  validator?: (value: string) => boolean;
  maxLength?: number;
  paragraph?: boolean;
}

export interface AlertFormFieldDate extends AlertFormField {
  type: 'date';
  placeholder?: string;
}

export interface AlertFormFieldTime extends AlertFormField {
  type: 'time';
  placeholder?: string;
}

export interface AlertFormFieldSingleSelect extends AlertFormField {
  type: 'single-select';
  options: string[];
  rangeLabels?: string[];
}

export interface AlertFormFieldMultiSelect extends AlertFormField {
  type: 'multi-select';
  options: string[];
}

export interface AlertFormFieldColorSelect extends AlertFormField {
  type: 'color-select';
  defaultValue?: Color;
}

export function formFieldIs<T extends AlertFormField>(
  field: AlertFormField,
  type: AlertFormFieldType
): field is T {
  return field.type === type;
}

export interface TimeInputConstraint {
  minKey: string;
  maxKey: string;
  error: string;
}

export interface AlertFormData {
  sections: AlertFormSection[];
  timeConstraints?: TimeInputConstraint[];
  onSubmit: (
    response: AlertFormResponse,
    context: AlertContext,
    next: AlertNextFn
  ) => void;
}

export interface AlertFormResponse {
  [field: string]: string | undefined;
}

export interface AlertNotice {
  type: 'note' | 'tip'; // add other options if necessary
  message: string;
}

export interface SelectMenuOption {
  value: string;
  label?: string;
}

/**
 * error key indicates error
 */
export type AlertContext = {
  error?: string | null;
  [key: string]: any;
};

export type AlertContextFn = (context: AlertContext) => void;

export interface AlertActionData {
  inputText?: string;
  textViewValue?: string;
  context?: any;
}

export interface AlertData {
  icon: IconElement;
  title: string;
  subtitle?: string;
  customSubtitle?: JSX.Element;
  message?: string;
  extras?: AlertDataExtra[];
  options?: AlertDataOption[];
  tabs?: {
    switchName: keyof ReadUserOptions;
    colorMap: ColorMap;
    tabs: AlertDataTab[];
  };
  editButtons?: AlertDataEditButton[];
  textView?: {
    text: string;
    update?: {
      text: string;
      disabled: boolean;
      fn: () => Promise<string>;
      afterUpdate?: string;
    };
  };
  textInput?: {
    placeholder?: string;
    match?: RegExp;
    matchError?: string;
    focusByDefault?: boolean;
    defaultValue?: string;
  };
  textHTML?: JSX.Element;
  form?: AlertFormData;
  confirmButton?: string;
  disableConfirmButton?: string;
  color: Color;
  cancelButton?: string;
  notice?: AlertNotice;
  custom?: {
    content: (context: AlertContext, setContext: AlertContextFn) => JSX.Element;
    initialContext?: AlertContext;
  };
  action?: (data: AlertActionData) => void;
}

export interface Alert {
  (alertData: AlertData): void;
}
