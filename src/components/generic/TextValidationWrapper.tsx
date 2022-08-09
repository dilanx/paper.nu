import React from 'react';
import Utility from '../../utility/Utility';

interface ValidateTextInput {
    value: string;
    validator: (value: string) => boolean;
}

function canBeValidated(nodeProps: any): nodeProps is ValidateTextInput {
    return (
        nodeProps &&
        nodeProps.value !== undefined &&
        nodeProps.validator !== undefined
    );
}

interface TextValidationWrapperProps {
    children: React.ReactNode;
    buttons?: React.MutableRefObject<any>[];
}

function TextValidationWrapper({
    children,
    buttons,
}: TextValidationWrapperProps) {
    let valid = true;
    Utility.forAllChildElements(children, (element) => {
        if (canBeValidated(element.props)) {
            const { value, validator } = element.props;
            if (value && !validator(value)) valid = false;
        }
    });
    if (buttons) {
        for (const button of buttons) {
            if (button.current) {
                button.current.disabled = !valid;
            }
        }
    }
    return <>{children}</>;
}

export default TextValidationWrapper;
