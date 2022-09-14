import {
  AlertFormField,
  AlertFormResponse,
  AlertFormSection,
  formFieldIs,
} from '../types/AlertTypes';
import Utility from './Utility';

type FieldWithValidator = AlertFormField & {
  validator: (value: string) => boolean;
};

function hasValidator(field: AlertFormField): field is FieldWithValidator {
  return 'validator' in field;
}

export function formIsValid(
  response: AlertFormResponse,
  sections: AlertFormSection[]
) {
  for (const section of sections) {
    for (const field of section.fields) {
      if (field.required && !response[field.name]) return false;
      if (hasValidator(field)) {
        if (field.validator(response[field.name])) return false;
      }
      if (field.type === 'time') {
        if (Utility.parseTime(response[field.name]) === undefined) return false;
      }
    }
  }
  return true;
}
