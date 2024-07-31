import SelectInput from '../generic/SelectInput';

// TODO continue topic select

export default function TopicSelect() {
  return (
    <SelectInput
      placeholder="Assign a topic to this course..."
      options={[
        {
          value:
            'long long text this is a long text long long text this is a long text long long text this is a long text',
          label:
            'long long text this is a long text long long text this is a long text long long text this is a long text',
        },
        { value: 'test2', label: 'test2' },
        { value: 'test3', label: 'test3' },
        { value: 'test4', label: 'test3' },
        { value: 'test5', label: 'test3' },
        { value: 'test6', label: 'test3' },
        { value: 'test7', label: 'test3' },
        { value: 'test8', label: 'test3' },
        { value: 'test9', label: 'test3' },
        { value: 'test10', label: 'test3' },
      ]}
    />
  );
}
