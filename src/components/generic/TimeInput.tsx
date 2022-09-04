import Utility from '../../utility/Utility';
import TextInput from './TextInput';

interface TimeInputProps {
  value: string;
  setValue: (value: string) => void;
  placeholder?: string;
  validator?: (value: string) => boolean;
}

function TimeInput(props: TimeInputProps) {
  return (
    <TextInput
      {...props}
      onBlur={() => {
        const { value, setValue } = props;
        if (value) {
          const time = Utility.parseTime(value);
          if (time) {
            setValue(Utility.convertTime(time, true));
          }
        }
      }}
    />
  );
}

TimeInput.defaultProps = {
  validator: (value: string) => Utility.parseTime(value) !== undefined,
};

export default TimeInput;
