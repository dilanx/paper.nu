import { ChevronRightIcon } from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/24/solid';

export default function RatingsTag() {
  return (
    <button className="flex items-center gap-2 rounded-lg bg-gray-100 px-2 py-1 shadow-sm hover:bg-gray-200 active:bg-gray-300">
      <p className="font-bold text-gray-500">0.0</p>
      <div className="flex items-center gap-0.5">
        <StarIcon className="h-5 w-5 text-gray-400" />
        <StarIcon className="h-5 w-5 text-gray-400" />
        <StarIcon className="h-5 w-5 text-gray-400" />
        <StarIcon className="h-5 w-5 text-gray-400" />
        <StarIcon className="h-5 w-5 text-gray-400" />
        <ChevronRightIcon className="h-4 w-4 stroke-2 text-gray-400" />
      </div>
    </button>
  );
}
