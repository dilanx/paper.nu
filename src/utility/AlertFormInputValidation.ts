import {
  AlertFormField,
  AlertFormResponse,
  AlertFormSection,
} from '../types/AlertTypes';
import { TextValidator } from '../types/BaseTypes';
import Utility from './Utility';

type FieldWithValidator = AlertFormField & {
  validator: TextValidator;
};

function hasValidator(field: AlertFormField): field is FieldWithValidator {
  return 'validator' in field && (field as any).validator !== undefined;
}

export function formIsValid(
  response: AlertFormResponse,
  sections: AlertFormSection[]
) {
  for (const section of sections) {
    for (const field of section.fields) {
      if (field.required && !response[field.name]) return false;
      if (hasValidator(field) && response[field.name]) {
        if (!field.validator(response[field.name])) return false;
      }
      if (field.type === 'time' && response[field.name]) {
        if (Utility.parseTime(response[field.name]) === undefined) return false;
      }
    }
  }
  return true;
}
