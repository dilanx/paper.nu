import { useEffect, useState } from 'react';
import { getScheduleData } from '../../DataManager';
import { AlertContext, AlertContextFn } from '../../types/AlertTypes';
import { ScrollSelectMenuLoadState } from '../../types/GenericMenuTypes';
import { CourseRatings } from '../../types/RatingTypes';
import { TermInfo } from '../../types/ScheduleTypes';
import ScrollSelectMenu from '../generic/ScrollSelectMenu';

interface RatingSubmitProps {
  course: string;
  termIds: TermInfo[];
  currentScheduleTermId?: string;
  ratings: CourseRatings;
  context: AlertContext;
  setContext: AlertContextFn;
}

export default function RatingSubmit({
  course,
  ratings,
  termIds,
  currentScheduleTermId,
  context,
  setContext,
}: RatingSubmitProps) {
  const [instructors, setInstructors] = useState<string[]>([]);
  const [showingMore, setShowingMore] =
    useState<ScrollSelectMenuLoadState>('visible');

  const showMore = () => {
    setShowingMore('loading');
    getScheduleData(context.termId, currentScheduleTermId)
      .then((data) => {
        const scheduleCourse = data?.data.find(
          (c) => `${c.subject} ${c.number}` === course
        );
        if (!scheduleCourse) {
          setShowingMore('hidden');
          return;
        }

        const termInstructors: string[] = [];
        for (const section of scheduleCourse.sections) {
          for (const instructor of section.instructors || []) {
            const instructorName = instructor.name;
            if (instructorName && !termInstructors.includes(instructorName)) {
              termInstructors.push(instructorName);
            }
          }
        }

        setInstructors(termInstructors);
        setShowingMore('hidden');
      })
      .catch((err) => {
        console.error(err);
        setShowingMore('error');
      });
  };

  useEffect(() => {
    setShowingMore('visible');
    if (!context.termId) {
      setInstructors([]);
      setShowingMore('hidden');
      return;
    }

    //const termRatings = ratings[context.termId];
    // const localInstructors = termRatings
    //   ? Object.keys(termRatings).sort((a, b) => a.localeCompare(b))
    //   : [];

    //setInstructors(localInstructors);
  }, [context.termId, ratings]);

  useEffect(() => {
    if (context.termId && context.instructor) {
      if (context.error) {
        setContext({ ...context, error: null });
      }
    } else {
      if (!context.error) {
        setContext({
          ...context,
          error: 'Missing term or instructor',
        });
      }
    }
  }, [context, setContext]);

  return (
    <div className="flex flex-col items-end">
      <div className="my-2 flex w-full">
        <ScrollSelectMenu
          size="sm"
          leftPiece
          className="flex-1"
          options={termIds
            .sort((a, b) => b.id.localeCompare(a.id))
            .map(({ id, name }) => ({
              value: id,
              label: name || 'Unknown',
            }))}
          selectedValue={context.termId}
          setSelectedValue={(termId) =>
            setContext({ ...context, termId, instructor: null })
          }
        />
        <ScrollSelectMenu
          size="xs"
          rightPiece
          className="flex-1"
          options={instructors
            .sort((a, b) => a.localeCompare(b))
            .map((instructor) => ({
              value: instructor,
            }))}
          selectedValue={context.instructor}
          setSelectedValue={(instructor) =>
            setContext({ ...context, instructor })
          }
          showMoreState={showingMore}
          showMore={showMore}
          emptyMessage={
            showingMore === 'hidden'
              ? 'No instructors this term'
              : 'No recent instructors'
          }
        />
      </div>
    </div>
  );
}
