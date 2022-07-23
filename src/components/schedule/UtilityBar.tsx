import { CalendarIcon, CameraIcon } from '@heroicons/react/outline';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Alert } from '../../types/AlertTypes';
import { Color, UserOptions } from '../../types/BaseTypes';
import { ScheduleData } from '../../types/ScheduleTypes';
import { exportScheduleAsImage } from '../../utility/Image';
import Schedule from './Schedule';

interface UtilityButtonProps {
    icon: (props: React.ComponentProps<'svg'>) => JSX.Element;
    color: Color;
    display: string;
    action: () => void;
}

function UtilityButton(props: UtilityButtonProps) {
    const color = props.color;
    return (
        <button
            className={`hover:text-${color}-500 transition-all duration-150 relative group`}
            onClick={() => props.action()}
        >
            <props.icon className="w-6 h-6" />
            <div
                className={`hidden group-hover:block absolute left-10 top-1/2 -translate-y-1/2 p-1 border-2 rounded-md whitespace-nowrap
                    bg-${color}-50 dark:bg-gray-800 border-${color}-500 text-${color}-500 dark:text-${color}-300 text-sm font-medium`}
            >
                {props.display}
            </div>
        </button>
    );
}

interface UtilityBarProps {
    schedule: ScheduleData;
    switches: UserOptions;
    alert: Alert;
}

function UtilityBar({ schedule, switches, alert }: UtilityBarProps) {
    const [takeImage, setTakeImage] = useState(false);

    useEffect(() => {
        if (takeImage) {
            exportScheduleAsImage(switches.get.dark as boolean).finally(() => {
                setTakeImage(false);
                toast.success('Exported schedule as image');
            });
        }
    }, [takeImage, switches]);

    return (
        <div
            className="absolute left-2 lg:left-0 top-1/2 -translate-y-1/2 border-2 border-green-300 p-1 rounded-xl bg-green-100 dark:bg-gray-700
                gap-2 flex flex-col opacity-40 hover:opacity-100 hover:shadow-lg transition-all duration-150 text-gray-600 dark:text-gray-300"
        >
            <UtilityButton
                icon={CameraIcon}
                color="orange"
                display="Download schedule as image"
                action={() => {
                    alert({
                        title: 'Download schedule as image',
                        icon: CameraIcon,
                        message:
                            'This will export your schedule as an image, which you can then share! By default, non-intrusive Plan Northwestern branding will appear in the top right, but that can be disabled in the settings.',
                        confirmButton: 'Download',
                        confirmButtonColor: 'orange',
                        iconColor: 'orange',
                        cancelButton: 'Cancel',
                        action: () => setTakeImage(true),
                    });
                }}
            />
            <UtilityButton
                icon={CalendarIcon}
                color="cyan"
                display="Export to calendar"
                action={() => {}}
            />

            {takeImage && (
                <div className="relative">
                    <Schedule
                        schedule={schedule}
                        alert={alert}
                        switches={switches}
                        sf={undefined as any}
                        imageMode={true}
                    />
                </div>
            )}
        </div>
    );
}

export default UtilityBar;
