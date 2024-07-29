import { convertDate, parseDate } from '@/utility/Utility';
import TextInput from './TextInput';

interface DateInputProps {
  value: string;
  setValue: (value: string) => void;
  placeholder?: string;
  required?: boolean;
}

function DateInput(props: DateInputProps) {
  return (
    <TextInput
      {...props}
      onBlur={() => {
        const { value, setValue } = props;
        if (value) {
          const date = parseDate(value);
          if (date) {
            setValue(convertDate(date));
          }
        }
      }}
    />
  );
}

DateInput.defaultProps = {
  validator: (value: string) => parseDate(value) !== undefined,
};

export default DateInput;
