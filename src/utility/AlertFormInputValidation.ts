import {
  AlertFormData,
  AlertFormField,
  AlertFormResponse,
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
  { sections, timeConstraints = [] }: AlertFormData
): [boolean, string | null] {
  for (const section of sections) {
    for (const field of section.fields) {
      if (field.required && !response[field.name])
        return [false, 'Missing required field'];
      if (hasValidator(field) && response[field.name]) {
        if (!field.validator(response[field.name] || ''))
          return [false, 'Invalid input'];
      }
      if (field.type === 'time' && response[field.name]) {
        if (Utility.parseTime(response[field.name]) === undefined)
          return [false, 'Invalid time'];
      }
    }
  }

  for (const tc of timeConstraints) {
    const min = Utility.parseTime(response[tc.minKey]);
    const max = Utility.parseTime(response[tc.maxKey]);
    if (min && max && Utility.timeCompare(max, min) <= 0) {
      return [false, tc.error];
    }
  }

  return [true, null];
}
