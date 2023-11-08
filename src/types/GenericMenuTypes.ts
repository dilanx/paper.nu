import { Color } from './BaseTypes';

export interface ScrollSelectMenuOption {
  value: string;
  label?: string;
  disabled?: boolean;
  color?: Color;
}

export interface BarChartValue {
  value: number;
  label: string;
}

export interface BarChartData {}
