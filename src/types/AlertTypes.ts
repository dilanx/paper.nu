export interface AlertDataExtra {
    title: string;
    content: string;
}

export interface AlertDataOption {
    name: string;
    title: string;
    description: string;
    singleAction?: () => void;
    saveToStorage?: boolean;
    buttonTextOn: string;
    buttonTextOff?: string;
    bonusAction?: (newSwitch: boolean) => void;
    requireConfirmation?: boolean;
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
    data: Set<T>;
    key: T;
    enabled: AlertDataEditButtonData;
    disabled: AlertDataEditButtonData;
}

export function editButtonIsToggleable(
    button: AlertDataEditButton
): button is ToggleableAlertDataEditButton<any> {
    return button.toggle;
}

export interface AlertData {
    icon: JSX.Element;
    title: string;
    subtitle?: string;
    customSubtitle?: JSX.Element;
    message: string;
    extras?: AlertDataExtra[];
    options?: AlertDataOption[];
    editButtons?: AlertDataEditButton[];
    textView?: string;
    textInput?: {
        placeholder?: string;
        match?: RegExp;
        matchError?: string;
        focusByDefault?: boolean;
    };
    confirmButton: string;
    confirmButtonColor: string;
    iconBackgroundColor: string;
    cancelButton?: string;
    action?: (inputText?: string) => void;
}

export interface Alert {
    (alertData: AlertData): void;
}
