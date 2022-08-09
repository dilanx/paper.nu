import { useRef, useState } from 'react';
import ScheduleManager from '../../ScheduleManager';
import { SearchFilter } from '../../types/SearchTypes';
import Utility from '../../utility/Utility';
import TextInput from '../generic/TextInput';
import TextValidationWrapper from '../generic/TextValidationWrapper';

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

    const buttonRef = useRef(null);

    return (
        <div className="m-4 grid grid-cols-2 gap-2">
            <TextValidationWrapper buttons={[buttonRef]}>
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
                        ref={buttonRef}
                        className="block mx-auto my-0 px-8 py-1 font-medium rounded-md bg-orange-400 text-white
                        hover:opacity-80 active:opacity-70 disabled:opacity-60 disabled:cursor-not-allowed transition-opacity duration-150"
                        onClick={() => {
                            filter.set({
                                subject,
                                startAfter: Utility.parseTime(startAfter),
                                startBefore: Utility.parseTime(startBefore),
                                endAfter: Utility.parseTime(endAfter),
                                endBefore: Utility.parseTime(endBefore),
                            });
                        }}
                    >
                        Apply
                    </button>
                </div>
            </TextValidationWrapper>
        </div>
    );
}

export default SearchAdvanced;
