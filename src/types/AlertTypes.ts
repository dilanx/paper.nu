import { Color, ColorMap, IconElement, ReadUserOptions } from './BaseTypes';

export interface AlertDataExtra {
  title: string;
  content: string;
}

export interface AlertDataOption {
  switch?: keyof ReadUserOptions;
  title: string;
  description: string;
  singleAction?: () => void;
  saveToStorage?: boolean;
  buttonTextOn?: string;
  buttonTextOff?: string;
  bonusAction?: (newSwitch: boolean) => void;
  confirmation?: string;
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
  color: string;
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

export interface AlertData {
  icon: IconElement;
  title: string;
  subtitle?: string;
  customSubtitle?: JSX.Element;
  message: string;
  extras?: AlertDataExtra[];
  options?: AlertDataOption[];
  tabs?: {
    switchName: keyof ReadUserOptions;
    colorMap: ColorMap;
    tabs: AlertDataTab[];
  };
  editButtons?: AlertDataEditButton[];
  textView?: string;
  textInput?: {
    placeholder?: string;
    match?: RegExp;
    matchError?: string;
    focusByDefault?: boolean;
  };
  textHTML?: JSX.Element;
  confirmButton: string;
  confirmButtonColor: Color;
  iconColor: Color;
  cancelButton?: string;
  action?: (inputText?: string) => void;
}

export interface Alert {
  (alertData: AlertData): void;
}
