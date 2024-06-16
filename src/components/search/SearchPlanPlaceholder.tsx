import {
  ArrowRightIcon,
  ArrowTopRightOnSquareIcon,
  CloudIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import MiniContentBlock from './MiniContentBlock';

export default function SearchPlanPlaceholder() {
  return (
    <div>
      <MiniContentBlock icon={MagnifyingGlassIcon} title="Search">
        Search across every course at Northwestern and view detailed information
        for each one using the <span className="font-medium">search bar</span>,
        along with the <span className="font-medium">browse</span> and{' '}
        <span className="font-medium">filter</span> buttons above.
      </MiniContentBlock>
      <MiniContentBlock icon={ArrowRightIcon} title="Drag">
        Drag courses from this search area into the quarter you want.
        Alternatively, you can click on the course and select the quarter you
        want to add it to.
      </MiniContentBlock>
      <MiniContentBlock icon={CloudIcon} title="Save">
        Easily create an account to save multiple plans and access them from
        anywhere, right from the <span className="font-medium">Schedules</span>{' '}
        tab at the bottom.
      </MiniContentBlock>
      <MiniContentBlock icon={ArrowTopRightOnSquareIcon} title="Share">
        Plans are built to be sharable. Just use the{' '}
        <span className="font-medium">Export</span> button to share a link to a
        copy of your plan.
      </MiniContentBlock>
    </div>
  );
}
