import { ChevronRightIcon } from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/24/solid';
import { OpenRatingsFn } from '../../types/RatingTypes';
import { useEffect, useState } from 'react';
import Account from '../../Account';
import { PaperError } from '../../utility/PaperError';
import { Alert } from '../../types/AlertTypes';
import Utility from '../../utility/Utility';
import { SpinnerCircularFixed } from 'spinners-react';

interface RatingsTagProps {
  course: string;
  alert: Alert;
  openRatings: OpenRatingsFn;
}

export default function RatingsTag({
  course,
  alert,
  openRatings,
}: RatingsTagProps) {
  const [[rating, total], setRating] = useState(['-', 0]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Account.getBasicRating(course)
      .then((rating) => {
        if (rating) {
          let avgTotal = 0;
          let totalCount = 0;
          for (const key in rating) {
            const count = rating[key as any as keyof typeof rating];
            const num = parseInt(key);
            avgTotal += num * count;
            totalCount += count;
          }
          setRating([(avgTotal / (totalCount || 1)).toFixed(1), totalCount]);
        }
        setLoading(false);
      })
      .catch((error: PaperError) => {
        if (error.status === 404) {
          setRating(['-', 0]);
          setLoading(false);
          return;
        }
        alert(Utility.errorAlert('ratings_get_basic', error));
      });
  }, [course, alert]);

  return (
    <button
      className="relative flex items-center justify-center gap-2 overflow-hidden rounded-lg bg-gray-100 px-2 py-1 shadow-sm hover:bg-gray-200 active:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-600 dark:active:bg-gray-500"
      onClick={() => {
        openRatings({
          course,
        });
      }}
    >
      <p className="font-bold text-gray-500 dark:text-gray-400">{rating}</p>
      <div className="relative flex items-center gap-0.5">
        <StarIcon className="h-5 w-5 text-gray-400" />
        <StarIcon className="h-5 w-5 text-gray-400" />
        <StarIcon className="h-5 w-5 text-gray-400" />
        <StarIcon className="h-5 w-5 text-gray-400" />
        <StarIcon className="h-5 w-5 text-gray-400" />
        <div
          className="absolute left-0 top-0 flex items-center gap-0.5 overflow-hidden transition-all delay-300 duration-500 ease-in-out"
          style={{
            width: `${(rating === '-' ? 0 : parseFloat(rating)) * 20}%`,
          }}
        >
          <StarIcon className="h-5 w-5 shrink-0 text-amber-400" />
          <StarIcon className="h-5 w-5 shrink-0 text-amber-400" />
          <StarIcon className="h-5 w-5 shrink-0 text-amber-400" />
          <StarIcon className="h-5 w-5 shrink-0 text-amber-400" />
          <StarIcon className="h-5 w-5 shrink-0 text-amber-400" />
        </div>
      </div>
      <p className="text-xs text-gray-400">{total}</p>
      <ChevronRightIcon className="h-4 w-4 stroke-2 text-gray-400" />
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/25">
          <SpinnerCircularFixed
            size={16}
            thickness={160}
            speed={200}
            color={'rgb(212, 212, 212)'}
            secondaryColor={'rgb(64, 64, 64)'}
          />
        </div>
      )}
    </button>
  );
}
