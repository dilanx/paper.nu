import {
  AlertFormFieldColorSelect,
  AlertFormFieldMultiSelect,
  AlertFormFieldSingleSelect,
  AlertFormFieldText,
  AlertFormFieldTime,
  AlertFormResponse,
  AlertFormSection,
  formFieldIs,
} from '../../../types/AlertTypes';
import { Color } from '../../../types/BaseTypes';
import ColorSelectInput from '../../generic/ColorSelectInput';
import MultiSelectInput from '../../generic/MultiSelectInput';
import Section from '../../generic/Section';
import SingleSelectInput from '../../generic/SingleSelectInput';
import TextInput from '../../generic/TextInput';
import TimeInput from '../../generic/TimeInput';

export const getAlertForm = (
  values: AlertFormResponse,
  setValue: (name: string, value: string) => void,
  sections: AlertFormSection[]
) =>
  sections.map((section, i) => (
    <Section
      title={section.title}
      description={section.description}
      totalRowItems={section.totalRowItems}
      key={`alert-form-section-${i}`}
    >
      {section.fields.map((field) => {
        if (formFieldIs<AlertFormFieldText>(field, 'text')) {
          return (
            <TextInput
              value={values[field.name] || ''}
              setValue={(value) => setValue(field.name, value)}
              placeholder={field.placeholder}
              validator={field.validator}
              maxLength={field.maxLength}
              required={field.required}
              paragraph={field.paragraph}
              key={`alert-form-field-${field.name}`}
            />
          );
        }
        if (formFieldIs<AlertFormFieldTime>(field, 'time')) {
          return (
            <TimeInput
              value={values[field.name] || ''}
              setValue={(value) => setValue(field.name, value)}
              placeholder={field.placeholder}
              required={field.required}
              key={`alert-form-field-${field.name}`}
            />
          );
        }
        if (formFieldIs<AlertFormFieldSingleSelect>(field, 'single-select')) {
          return (
            <SingleSelectInput
              title={field.name}
              options={field.options}
              value={values[field.name]}
              setValue={(value) => setValue(field.name, value)}
              required={field.required}
              key={`alert-form-field-${field.name}`}
            />
          );
        }
        if (formFieldIs<AlertFormFieldMultiSelect>(field, 'multi-select')) {
          return (
            <MultiSelectInput
              title={field.name}
              options={field.options}
              value={
                values[field.name] ? values[field.name]?.split(',') || [] : []
              }
              setValue={(selected) => setValue(field.name, selected.join(','))}
              required={field.required}
              key={`alert-form-field-${field.name}`}
            />
          );
        }
        if (formFieldIs<AlertFormFieldColorSelect>(field, 'color-select')) {
          return (
            <ColorSelectInput
              title={field.name}
              value={values[field.name] as Color}
              setValue={(value) => setValue(field.name, value)}
              required={field.required}
              key={`alert-form-field-${field.name}`}
            />
          );
        }
        return undefined;
      })}
    </Section>
  ));
