import {
  ArrowDownOnSquareIcon,
  ArrowTopRightOnSquareIcon,
  CalendarIcon,
  CameraIcon,
  MapIcon,
} from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Alert } from '../../../types/AlertTypes';
import {
  ContextMenu,
  ContextMenuData,
  UserOptions,
} from '../../../types/BaseTypes';
import { ScheduleData } from '../../../types/ScheduleTypes';
import { exportScheduleAsICS, getSections } from '../../../utility/Calendar';
import { exportScheduleAsImage } from '../../../utility/Image';
import Utility from '../../../utility/Utility';
import ToolbarAccount from './ToolbarAccount';
import ToolbarButton from './ToolbarButton';

interface ToolbarProps {
  alert: Alert;
  contextMenuData?: ContextMenuData;
  contextMenu: ContextMenu;
  schedule: ScheduleData;
  openMap?: () => void;
  switches: UserOptions;
}

function Toolbar({
  alert,
  contextMenuData,
  contextMenu,
  schedule,
  openMap,
  switches,
}: ToolbarProps) {
  const [takeImage, setTakeImage] = useState(false);

  useEffect(() => {
    if (takeImage) {
      exportScheduleAsImage(switches.get.dark).finally(() => {
        setTakeImage(false);
        toast.success('Exported schedule as image');
      });
    }
  }, [takeImage, switches]);

  return (
    <div className="sticky top-0 flex w-full justify-center gap-1 px-4 pt-4 lg:justify-end">
      <ToolbarButton
        icon={MapIcon}
        onClick={() => {
          if (openMap) {
            openMap();
          }
        }}
      >
        Campus Map
      </ToolbarButton>
      <ToolbarButton
        icon={ArrowDownOnSquareIcon}
        active={contextMenuData?.name === 'export'}
        onClick={(x, y) => {
          contextMenu({
            name: 'export',
            x,
            y,
            items: [
              {
                text: 'Export as image',
                icon: CameraIcon,
                onClick: () => {
                  alert({
                    title: 'Export schedule as image',
                    icon: CameraIcon,
                    message:
                      'This will export your schedule as an image, which you can then share!',
                    confirmButton: 'Download',
                    color: 'sky',
                    cancelButton: 'Cancel',
                    action: () => setTakeImage(true),
                  });
                },
              },
              {
                text: 'Export to calendar',
                icon: CalendarIcon,
                onClick: () => {
                  const { validSections, invalidSections } =
                    getSections(schedule);
                  const noValidSections =
                    Object.keys(validSections).length === 0;

                  const invalidSectionMessage =
                    Object.keys(invalidSections).length > 0
                      ? `\n\nThe following sections cannot be added to the exported schedule because they don't have valid meeting time data: ${Utility.formatSections(
                          invalidSections
                        )}`
                      : '';

                  alert({
                    title: 'Export schedule to calendar',
                    icon: CalendarIcon,
                    message: `This will export your schedule to an ICS file, which you can then import into your calendar app! Ensure that you set your time zone to central time (Chicago, United States).${invalidSectionMessage}`,
                    textHTML: (
                      <p className="my-2">
                        Here are some instructions on how to import events into
                        some popular calendar apps:{' '}
                        <a href="https://support.apple.com/en-ca/guide/calendar/icl1023/mac">
                          Apple Calendar
                        </a>
                        ,{' '}
                        <a href="https://support.google.com/calendar/answer/37118?hl=en&co=GENIE.Platform%3DDesktop">
                          Google Calendar
                        </a>
                        ,{' '}
                        <a href="https://support.microsoft.com/en-us/office/import-calendars-into-outlook-8e8364e1-400e-4c0f-a573-fe76b5a2d379">
                          Microsoft Outlook
                        </a>
                      </p>
                    ),
                    confirmButton: 'Download',
                    disableConfirmButton: noValidSections
                      ? 'Nothing to export'
                      : undefined,
                    color: 'red',
                    cancelButton: 'Cancel',
                    action: () => {
                      toast.promise(exportScheduleAsICS(validSections), {
                        loading: 'Exporting schedule...',
                        success: 'Exported schedule',
                        error: (res) => {
                          console.error(res);
                          return 'Failed to export schedule';
                        },
                      });
                    },
                  });
                },
              },
            ],
          });
        }}
      >
        Export
      </ToolbarButton>
      <ToolbarButton
        icon={ArrowTopRightOnSquareIcon}
        onClick={() => {
          alert({
            title: 'Ready to share!',
            message:
              'All of your data is stored in the URL. When you make changes, the URL is updated to reflect them. Save it somewhere, or share with a friend!',
            confirmButton: 'Copy to clipboard',
            cancelButton: 'Close',
            color: 'pink',
            icon: ArrowTopRightOnSquareIcon,
            textView: window.location.href,
            action: () => {
              navigator.clipboard.writeText(window.location.href);
              toast.success('URL copied to clipboard');
            },
          });
        }}
      >
        Share
      </ToolbarButton>
      <ToolbarAccount />
    </div>
  );
}

export default Toolbar;
