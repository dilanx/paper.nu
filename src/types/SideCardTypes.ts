import { ReactNode } from 'react';
import { Color, IconElement } from './BaseTypes';

export interface SideCardData {
  type: string;
  themeColor: Color;
  tag?: {
    text: string;
    color: Color;
  };
  title: string;
  subtitle?: string;
  alertMessage?: string;
  message?: string;
  toolbar?: ReactNode;
  items?: SideCardItemData[];
  buttons?: AnySideCardButtonData[];
  link?: string;
  developer?: ReactNode;
}

export interface SideCardItemData {
  key: string;
  icon?: IconElement;
  value: ReactNode;
}

export interface SideCardButtonData {
  text: string;
  onClick: (close: () => void) => void;
  danger?: boolean;
  disabled?: boolean;
  disabledText?: string;
}

export interface ToggleableSideCardButtonData<T = any> {
  toggle: true;
  data: Set<T> | T[];
  key: T;
  indexProperty?: keyof T;
  enabled: SideCardButtonData;
  disabled: SideCardButtonData;
}

export type AnySideCardButtonData =
  | SideCardButtonData
  | ToggleableSideCardButtonData
  | 'divider';

export function sideCardButtonIsToggleable(
  button: SideCardButtonData | ToggleableSideCardButtonData
): button is ToggleableSideCardButtonData {
  return (button as ToggleableSideCardButtonData).toggle === true;
}

export interface SideCard {
  (sideCardData: SideCardData): void;
}
