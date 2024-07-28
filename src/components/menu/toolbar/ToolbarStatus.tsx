import { useApp } from '@/app/Context';
import Tooltip from '@/components/generic/Tooltip';
import { Document } from '@/types/AccountTypes';
import { SaveState } from '@/types/BaseTypes';
import { Mode } from '@/utility/Constants';
import {
  CalendarIcon,
  CheckCircleIcon,
  RectangleStackIcon,
  UserGroupIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import { SpinnerCircularFixed } from 'spinners-react';
import { generatePersistentShortLink } from './Share';
import ToolbarStatusButton from './ToolbarStatusButton';

function Divider() {
  return <div className="h-4 w-[1px] bg-gray-300 dark:bg-gray-500" />;
}

interface ToolbarStatusProps {
  activeItem: Document;
  saveState: SaveState;
}

export default function ToolbarStatus({
  activeItem,
  saveState,
}: ToolbarStatusProps) {
  const { userOptions } = useApp();
  const [idCopied, setIdCopied] = useState(false);
  const [shareStatus, setShareStatus] = useState<
    'idle' | 'loading' | 'copied' | 'error'
  >('idle');

  const isSchedule = userOptions.get.mode === Mode.SCHEDULE;

  useEffect(() => {
    if (idCopied) {
      const timeout = setTimeout(() => {
        setIdCopied(false);
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [idCopied]);

  useEffect(() => {
    if (shareStatus === 'copied') {
      const timeout = setTimeout(() => {
        setShareStatus('idle');
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [shareStatus]);

  return (
    <div className="flex flex-1 items-center gap-2 font-semibold text-gray-400">
      <ToolbarStatusButton
        onClick={() => {
          navigator.clipboard.writeText(activeItem.id);
          setIdCopied(true);
        }}
      >
        {isSchedule ? (
          <CalendarIcon className="h-4 min-h-[1rem] w-4 min-w-[1rem]" />
        ) : (
          <RectangleStackIcon className="h-4 min-h-[1rem] w-4 min-w-[1rem]" />
        )}
        <p className="overflow-hidden text-ellipsis whitespace-nowrap text-xs">
          {activeItem.name || '-'}
        </p>
        <Tooltip mini color="gray" className="-bottom-6 left-0 z-40">
          {idCopied ? 'Copied ID to clipboard' : `ID: ${activeItem.id}`}
        </Tooltip>
      </ToolbarStatusButton>
      {activeItem.public && (
        <>
          <Divider />
          <ToolbarStatusButton
            onClick={() => {
              setShareStatus('loading');
              generatePersistentShortLink(activeItem.id, isSchedule)
                .then((link) => {
                  navigator.clipboard.writeText(link);
                  setShareStatus('copied');
                })
                .catch((e) => {
                  console.error(e);
                  setShareStatus('error');
                });
            }}
          >
            {shareStatus === 'loading' ? (
              <SpinnerCircularFixed
                size={16}
                thickness={160}
                speed={200}
                color="#a1a1aa"
                secondaryColor={userOptions.get.dark ? '#404040' : '#f5f5f5'}
              />
            ) : (
              <UserGroupIcon className="group relative h-4 w-4" />
            )}

            <Tooltip mini color="sky" className="-bottom-6 left-0 z-40">
              {shareStatus === 'idle'
                ? 'Accessible by link'
                : shareStatus === 'loading'
                ? 'Retrieving share link...'
                : shareStatus === 'copied'
                ? 'Copied share link to clipboard'
                : 'Error when retrieving share link'}
            </Tooltip>
          </ToolbarStatusButton>
        </>
      )}
      <Divider />
      <ToolbarStatusButton>
        {saveState === 'idle' && (
          <>
            <CheckCircleIcon className="h-4 w-4" />
            <p className="font-normal">saved!</p>
          </>
        )}
        {(saveState === 'start' ||
          saveState === 'wait' ||
          saveState === 'save') && (
          <>
            <SpinnerCircularFixed
              size={14}
              thickness={160}
              speed={200}
              color="#a1a1aa"
              secondaryColor={userOptions.get.dark ? '#404040' : '#f5f5f5'}
            />
            <p className="font-normal">saving...</p>
          </>
        )}
        {saveState === 'error' && (
          <>
            <XCircleIcon className="h-4 w-4 text-red-500" />
            <p className="font-normal text-red-500">error when saving.</p>
          </>
        )}
        <Tooltip mini color="green" className="-bottom-6 left-0 z-40">
          {saveState === 'idle' && 'All changes saved'}
          {(saveState === 'start' || saveState === 'wait') &&
            'Preparing to save...'}
          {saveState === 'save' && 'Saving...'}
          {saveState === 'error' &&
            'An error occurred when saving. Try again later.'}
        </Tooltip>
      </ToolbarStatusButton>
    </div>
  );
}
