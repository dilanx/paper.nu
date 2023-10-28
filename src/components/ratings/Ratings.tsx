import { StarIcon } from '@heroicons/react/24/solid';

export default function Ratings() {
  return (
    <div className="flex items-center gap-2 rounded-lg bg-gray-100 px-2 py-1 shadow-sm">
      <div>
        <p className="font-bold text-gray-500">0.0</p>
      </div>
      <div className="flex items-center gap-0.5">
        <StarIcon className="h-5 w-5 text-gray-400" />
        <StarIcon className="h-5 w-5 text-gray-400" />
        <StarIcon className="h-5 w-5 text-gray-400" />
        <StarIcon className="h-5 w-5 text-gray-400" />
        <StarIcon className="h-5 w-5 text-gray-400" />
      </div>
    </div>
  );
}
