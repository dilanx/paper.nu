import { ArrowTrendingUpIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import { getLatestTermId, getTermName } from '../../DataManager';
import { AlertContext, AlertContextFn } from '../../types/AlertTypes';
import { Color, OrganizedTerms } from '../../types/BaseTypes';
import ScrollSelectMenu from '../generic/ScrollSelectMenu';

interface ChangeTermProps {
  terms: OrganizedTerms;
  context: AlertContext;
  setContext: AlertContextFn;
}

export default function ChangeTerm({
  terms,
  context,
  setContext,
}: ChangeTermProps) {
  const [isLatest, setIsLatest] = useState(false);

  useEffect(() => {
    if (context.year && context.quarter) {
      if (context.error) {
        setContext({ ...context, error: null });
      }
      const termId = terms?.[context.year][context.quarter];
      setIsLatest(getLatestTermId() === termId);
    } else {
      if (!context.error) {
        setContext({
          ...context,
          error: 'Missing year or quarter',
        });
      }
      setIsLatest(false);
    }
  }, [terms, context, setContext]);

  return (
    <div className="flex flex-col items-end">
      <div className="my-2 flex w-full">
        <ScrollSelectMenu
          leftPiece
          className="flex-1"
          options={Object.keys(terms)
            .sort((a, b) => b.localeCompare(a))
            .map((year) => ({
              value: year,
            }))}
          selectedValue={context.year}
          setSelectedValue={(year) => setContext({ ...context, year })}
        />
        <ScrollSelectMenu
          rightPiece
          className="flex-1"
          options={[
            ['Winter', 'sky'],
            ['Spring', 'lime'],
            ['Summer', 'yellow'],
            ['Fall', 'orange'],
          ].map(([quarter, color]) => ({
            value: quarter,
            disabled: !context.year || !terms[context.year][quarter],
            color: color as Color,
          }))}
          selectedValue={context.quarter}
          setSelectedValue={(quarter) => setContext({ ...context, quarter })}
        />
      </div>
      <button
        className={`flex gap-2 rounded-md border bg-gray-100 px-2 py-1 text-xs font-bold shadow-sm dark:border-gray-500 dark:bg-gray-700 ${
          isLatest
            ? 'cursor-default border-gray-200 text-gray-300 dark:border-gray-600 dark:text-gray-500'
            : 'border-gray-300 text-gray-400 hover:bg-gray-200 active:bg-gray-300 dark:hover:bg-gray-600 dark:active:bg-gray-500'
        }`}
        disabled={isLatest}
        onClick={() => {
          const latestTermId = getLatestTermId();
          if (latestTermId) {
            const [year, quarter] = getTermName(latestTermId)?.split(' ') || [
              null,
              null,
            ];
            setContext({ ...context, year, quarter });
          }
        }}
      >
        <ArrowTrendingUpIcon className="h-4 w-4 stroke-2" />
        <span>USE LATEST TERM</span>
      </button>
    </div>
  );
}
