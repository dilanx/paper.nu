import React from 'react';
import Utility from '../../utility/Utility';

interface ValidateInput {
  value: string;
  validator?: (value: string) => boolean;
  required?: boolean;
}

function canBeValidated(nodeProps: any): nodeProps is ValidateInput {
  return (
    nodeProps &&
    nodeProps.value !== undefined &&
    (nodeProps.validator !== undefined || nodeProps.required !== undefined)
  );
}

interface InputValidationWrapperProps {
  children: React.ReactNode;
  buttons?: React.MutableRefObject<any>[];
}

function InputValidationWrapper({
  children,
  buttons,
}: InputValidationWrapperProps) {
  let valid = true;
  Utility.forAllChildElements(children, (element) => {
    if (canBeValidated(element.props)) {
      const { value, validator, required } = element.props;
      if (value && validator && !validator(value)) valid = false;
      if (!value && required) valid = false;
      if (Array.isArray(value) && value.length === 0 && required) valid = false;
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

export default InputValidationWrapper;
