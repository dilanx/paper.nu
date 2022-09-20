import { Color, IconElement } from './BaseTypes';

export interface SideCardData {
  type: string;
  themeColor: Color;
  title: string;
  subtitle?: string;
  message?: string;
  items?: SideCardDataItem[];
}

export interface SideCardDataItem {
  key: string;
  icon?: IconElement;
  value: string;
}

export interface SideCard {
  (sideCardData: SideCardData): void;
}
