import {
  ArrowRightIcon,
  ArrowTopRightOnSquareIcon,
  CloudIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import MiniContentBlock from './MiniContentBlock';

interface SearchSchedulePlaceholderProps {
  termName: string;
}

export default function SearchSchedulePlaceholder({
  termName,
}: SearchSchedulePlaceholderProps) {
  return (
    <div>
      <MiniContentBlock icon={MagnifyingGlassIcon} title="Search">
        Search across every course offered{' '}
        <span className="font-bold">{termName}</span> at Northwestern and view
        detailed information for each one. Search courses by subject and number,
        title, time slot, instructor, or location using the{' '}
        <span className="font-medium">search bar</span>, along with the{' '}
        <span className="font-medium">browse</span> and{' '}
        <span className="font-medium">filter</span> buttons above.
      </MiniContentBlock>
      <MiniContentBlock icon={ArrowRightIcon} title="Add">
        Add any of the sections for a course to your schedule and watch as they
        appear at the appropriate time.
      </MiniContentBlock>
      <MiniContentBlock icon={CloudIcon} title="Save">
        Easily create an account to save multiple schedules and access them from
        anywhere, right from the <span className="font-medium">Schedules</span>{' '}
        tab at the bottom.
      </MiniContentBlock>
      <MiniContentBlock icon={ArrowTopRightOnSquareIcon} title="Share">
        Schedules are built to be sharable. Just use the{' '}
        <span className="font-medium">Export</span> button to share your
        schedule as an image or a link, or export it to your calendar.
      </MiniContentBlock>
    </div>
  );
}
