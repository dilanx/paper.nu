import { CameraIcon } from '@heroicons/react/outline';
import { useEffect, useState } from 'react';
import { Color, UserOptions } from '../../types/BaseTypes';
import { ScheduleData } from '../../types/ScheduleTypes';
import { downloadScheduleAsImage } from '../../utility/Image';
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
}

function UtilityBar({ schedule, switches }: UtilityBarProps) {
    const [takeImage, setTakeImage] = useState(false);

    useEffect(() => {
        if (takeImage) {
            downloadScheduleAsImage(switches.get.dark as boolean).finally(() =>
                setTakeImage(false)
            );
        }
    }, [takeImage, switches]);

    return (
        <div
            className="absolute left-2 lg:left-0 top-1/2 -translate-y-1/2 border-2 border-green-300 p-1 rounded-xl bg-green-100 gap-2
                flex flex-col opacity-40 hover:opacity-100 hover:shadow-lg transition-all duration-150 text-gray-600"
        >
            <UtilityButton
                icon={CameraIcon}
                color="orange"
                display="Download schedule as image"
                action={() => {
                    setTakeImage(true);
                }}
            />

            {takeImage && (
                <div className="relative">
                    <Schedule
                        schedule={schedule}
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
