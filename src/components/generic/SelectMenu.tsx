import Select, { StylesConfig } from 'react-select';

const lightStyles: StylesConfig = {
  control: (styles, props) => ({
    ...styles,
    backgroundColor: '#f5f5f5', // bg-gray-200
    borderWidth: '2px', // border-2
    borderRadius: '0.375rem', // rounded-md
    outline: 'none', // outline-none
    ':hover': {
      borderColor: props.isFocused ? '#8b5cf6' : '#a3a3a3', // hover:border-gray-400
    },
    borderColor: props.isFocused ? '#8b5cf6' : '#f5f5f5', // focus:border-purple-500
    boxShadow: 'none',
  }),
  dropdownIndicator: (styles, props) => ({
    ...styles,
    color: props.isFocused ? '#8b5cf6' : styles.color, // text-violet-500
  }),
  menu: (styles) => ({
    ...styles,
    zIndex: 200,
  }),
};

export default function SelectMenu() {
  return (
    <Select
      styles={lightStyles}
      options={[
        { value: 'chocolate', label: 'Chocolate' },
        { value: 'strawberry', label: 'Strawberry' },
        { value: 'vanilla', label: 'Vanilla' },
      ]}
      menuPosition="fixed"
    />
  );
}
