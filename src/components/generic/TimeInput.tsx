import { convertTime, parseTime } from '@/utility/Utility';
import TextInput from './TextInput';

interface TimeInputProps {
  value: string;
  setValue: (value: string) => void;
  placeholder?: string;
  required?: boolean;
}

function TimeInput(props: TimeInputProps) {
  return (
    <TextInput
      {...props}
      onBlur={() => {
        const { value, setValue } = props;
        if (value) {
          const time = parseTime(value);
          if (time) {
            setValue(convertTime(time, true));
          }
        }
      }}
    />
  );
}

TimeInput.defaultProps = {
  validator: (value: string) => parseTime(value) !== undefined,
};

export default TimeInput;
