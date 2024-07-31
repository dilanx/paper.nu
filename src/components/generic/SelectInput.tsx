import { useApp } from '@/app/Context';
import Select, { ThemeConfig } from 'react-select';

const theme =
  (dark: boolean): ThemeConfig =>
  (theme) => ({
    ...theme,
    borderRadius: 8,
    colors: {
      primary: dark ? '#34d399' : '#10b981',
      primary75: dark ? '#10b981' : '#34d399',
      primary50: dark ? '#059669' : '#6ee7b7',
      primary25: dark ? '#047857' : '#a7f3d0',
      danger: '#ef4444',
      dangerLight: '#fca5a5',
      neutral0: dark ? '#262626' : '#fafafa',
      neutral5: dark ? '#404040' : '#f5f5f5',
      neutral10: dark ? '#525252' : '#e5e5e5',
      neutral20: dark ? '#737373' : '#d4d4d4',
      neutral30: dark ? '#a3a3a3' : '#a3a3a3',
      neutral40: dark ? '#d4d4d4' : '#737373',
      neutral50: dark ? '#e5e5e5' : '#525252',
      neutral60: dark ? '#f5f5f5' : '#404040',
      neutral70: dark ? '#fafafa' : '#262626',
      neutral80: dark ? '#ffffff' : '#171717',
      neutral90: dark ? '#ffffff' : '#171717',
    },
  });

interface SelectOption {
  value: string;
  label: string;
}

interface SelectInputProps {
  options: SelectOption[];
  placeholder?: string;
  defaultValue?: SelectOption;
}

export default function SelectInput({
  options,
  placeholder,
}: SelectInputProps) {
  const { userOptions } = useApp();

  return (
    <Select
      isSearchable
      isClearable
      className="text-left font-sans text-sm font-normal"
      theme={theme(!!userOptions.get.dark)}
      options={options}
      placeholder={placeholder}
    />
  );
}
