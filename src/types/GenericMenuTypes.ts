import { Color } from './BaseTypes';

export interface ScrollSelectMenuOption {
  value: string;
  label?: string;
  disabled?: boolean;
  color?: Color;
}

export type ScrollSelectMenuLoadState =
  | 'visible'
  | 'loading'
  | 'hidden'
  | 'error';

export type BarChartMode = 'horizontal' | 'vertical';

export interface BarChartValue {
  value: number;
  label: string;
}
