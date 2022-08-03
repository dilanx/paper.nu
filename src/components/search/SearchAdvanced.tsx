import { useState } from 'react';
import ScheduleManager from '../../ScheduleManager';
import { SearchFilter } from '../../types/BaseTypes';
import Utility from '../../utility/Utility';
import TextInput from '../generic/TextInput';

interface SectionProps {
    title: string;
    fullRow?: boolean;
    children: React.ReactNode;
}

function Section({ title, fullRow, children }: SectionProps) {
    return (
        <div className={`my-2${fullRow ? ' col-span-2' : ''}`}>
            <p className="text-sm font-bold text-gray-500 dark:text-gray-400 m-1">
                {title}
            </p>
            {children}
        </div>
    );
}

interface SearchAdvancedProps {
    filter: SearchFilter;
}

function SearchAdvanced({ filter }: SearchAdvancedProps) {
    const [subject, setSubject] = useState('');
    const [startAfter, setStartAfter] = useState('');
    const [startBefore, setStartBefore] = useState('');
    const [endAfter, setEndAfter] = useState('');
    const [endBefore, setEndBefore] = useState('');

    return (
        <div className="m-4 grid grid-cols-2 gap-2">
            <Section title="SUBJECT" fullRow>
                <TextInput
                    value={subject}
                    setValue={setSubject}
                    placeholder="ex. COMP_SCI"
                    validator={(value) =>
                        ScheduleManager.isSchoolSubject(value.toUpperCase())
                    }
                />
            </Section>
            <Section title="START AFTER">
                <TextInput
                    value={startAfter}
                    setValue={setStartAfter}
                    placeholder="XX:XX am/pm"
                    validator={(value) =>
                        Utility.parseTime(value) !== undefined
                    }
                />
            </Section>
            <Section title="START BEFORE">
                <TextInput
                    value={startBefore}
                    setValue={setStartBefore}
                    placeholder="XX:XX am/pm"
                    validator={(value) =>
                        Utility.parseTime(value) !== undefined
                    }
                />
            </Section>
            <Section title="END AFTER">
                <TextInput
                    value={endAfter}
                    setValue={setEndAfter}
                    placeholder="XX:XX am/pm"
                    validator={(value) =>
                        Utility.parseTime(value) !== undefined
                    }
                />
            </Section>
            <Section title="END BEFORE">
                <TextInput
                    value={endBefore}
                    setValue={setEndBefore}
                    placeholder="XX:XX am/pm"
                    validator={(value) =>
                        Utility.parseTime(value) !== undefined
                    }
                />
            </Section>

            <div className="w-full col-span-2">
                <button
                    className="block mx-auto my-0 px-8 py-1 font-medium rounded-md bg-orange-400 text-white
                        hover:opacity-80 active:opacity-70 transition-opacity duration-150"
                >
                    Apply
                </button>
            </div>
        </div>
    );
}

export default SearchAdvanced;
