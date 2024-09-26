import { useEffect, useState } from 'react';
import { InfoSetData } from '@/types/BaseTypes';
import { getPlaceholderInfoSet, initializeInfoSet } from '@/utility/Utility';

interface InfoSetProps {
  title: string;
  data: InfoSetData;
}

function InfoSet({ title, data }: InfoSetProps) {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<InfoSetData<string>>(
    getPlaceholderInfoSet(data)
  );

  useEffect(() => {
    initializeInfoSet(data).then((data) => setValues(data));
  }, [data]);

  return (
    <div className="my-4">
      <button
        className="mx-auto block rounded-md px-4 py-1 font-mono text-2xs font-bold tracking-wide
        text-gray-500 hover:bg-gray-100 active:bg-gray-100 active:opacity-75
        dark:text-gray-400 dark:hover:bg-gray-600 dark:active:bg-gray-600 dark:active:opacity-75"
        onClick={() => setOpen(!open)}
      >
        {open ? `HIDE ${title}` : `SHOW ${title}`}
      </button>
      {open && (
        <div className="my-1 flex flex-col items-center justify-center gap-1 text-center font-mono text-xs text-gray-400 dark:text-gray-500">
          {values.map(([k, v], i) => (
            <p className="" key={`is-item-${i}`}>
              {k}: {v}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

export default InfoSet;
