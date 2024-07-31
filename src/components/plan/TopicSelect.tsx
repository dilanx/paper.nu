import { Course } from '@/types/PlanTypes';
import SelectInput from '../generic/SelectInput';
import { useMemo } from 'react';
import { getCourseTopics } from '@/app/Plan';

interface TopicSelectProps {
  course: Course;
  onChange: (topic: string | null) => void;
}

export default function TopicSelect({ course, onChange }: TopicSelectProps) {
  const topics =
    useMemo(() => getCourseTopics(course)?.map((t) => t[0]), [course]) || [];

  return (
    <>
      <SelectInput
        placeholder="Assign a topic to this course..."
        onChange={onChange}
        defaultValue={course.itopic || null}
        options={topics}
      />
      <p className="m-2 text-xs font-light text-gray-400">
        This course offers multiple topics. You can select one to save to your
        plan for this course.
      </p>
    </>
  );
}
