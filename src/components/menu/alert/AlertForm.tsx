import {
  AlertFormFieldMultiSelect,
  AlertFormFieldText,
  AlertFormFieldTime,
  AlertFormResponse,
  AlertFormSection,
  formFieldIs,
} from '../../../types/AlertTypes';
import MultiSelectInput from '../../generic/MultiSelectInput';
import Section from '../../generic/Section';
import TextInput from '../../generic/TextInput';
import TimeInput from '../../generic/TimeInput';

export const getAlertForm = (
  values: AlertFormResponse,
  setValue: (name: string, value: string) => void,
  sections: AlertFormSection[]
) =>
  sections.map((section) => (
    <Section
      title={section.title}
      fullRow={section.fullRow}
      key={`alert-form-section-${section.title}`}
    >
      {section.fields.map((field) => {
        if (formFieldIs<AlertFormFieldText>(field, 'text')) {
          return (
            <TextInput
              value={values[field.name]}
              setValue={(value) => setValue(field.name, value)}
              placeholder={field.placeholder}
              validator={field.validator}
              maxLength={field.maxLength}
              key={`alert-form-field-${field.name}`}
            />
          );
        }
        if (formFieldIs<AlertFormFieldTime>(field, 'time')) {
          return (
            <TimeInput
              value={values[field.name]}
              setValue={(value) => setValue(field.name, value)}
              placeholder={field.placeholder}
              key={`alert-form-field-${field.name}`}
            />
          );
        }
        if (formFieldIs<AlertFormFieldMultiSelect>(field, 'multi-select')) {
          return (
            <MultiSelectInput
              title={field.name}
              options={field.options}
              selected={values[field.name] ? values[field.name].split(',') : []}
              setSelected={(selected) =>
                setValue(field.name, selected.join(','))
              }
              key={`alert-form-field-${field.name}`}
            />
          );
        }
        return undefined;
      })}
    </Section>
  ));
