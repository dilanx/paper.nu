import { useRef, useState } from 'react';
import ScheduleManager from '../../ScheduleManager';
import { SearchFilter } from '../../types/SearchTypes';
import Utility from '../../utility/Utility';
import MultiSelectInput from '../generic/MultiSelectInput';
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
  const [subject, setSubject] = useState(filter.get.subject || '');
  const [startAfter, setStartAfter] = useState(
    filter.get.startAfter
      ? Utility.convertTime(filter.get.startAfter, true)
      : ''
  );
  const [startBefore, setStartBefore] = useState(
    filter.get.startBefore
      ? Utility.convertTime(filter.get.startBefore, true)
      : ''
  );
  const [endAfter, setEndAfter] = useState(
    filter.get.endAfter ? Utility.convertTime(filter.get.endAfter, true) : ''
  );
  const [endBefore, setEndBefore] = useState(
    filter.get.endBefore ? Utility.convertTime(filter.get.endBefore, true) : ''
  );
  const [meetingDays, setMeetingDays] = useState(filter.get.meetingDays || []);

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
            validator={(value) => Utility.parseTime(value) !== undefined}
          />
        </Section>
        <Section title="START BEFORE">
          <TextInput
            value={startBefore}
            setValue={setStartBefore}
            placeholder="XX:XX am/pm"
            validator={(value) => Utility.parseTime(value) !== undefined}
          />
        </Section>
        <Section title="END AFTER">
          <TextInput
            value={endAfter}
            setValue={setEndAfter}
            placeholder="XX:XX am/pm"
            validator={(value) => Utility.parseTime(value) !== undefined}
          />
        </Section>
        <Section title="END BEFORE">
          <TextInput
            value={endBefore}
            setValue={setEndBefore}
            placeholder="XX:XX am/pm"
            validator={(value) => Utility.parseTime(value) !== undefined}
          />
        </Section>
        <Section title="MEETING DAYS" fullRow>
          <MultiSelectInput
            title="meeting-days"
            options={['Mo', 'Tu', 'We', 'Th', 'Fr']}
            selected={meetingDays}
            setSelected={setMeetingDays}
          />
        </Section>
        <div className="w-full col-span-2">
          <button
            ref={buttonRef}
            className="block mx-auto my-0 px-8 py-1 font-medium rounded-md bg-orange-400 text-white
                        hover:opacity-80 active:opacity-70 disabled:opacity-60 disabled:cursor-not-allowed transition-opacity duration-150"
            onClick={() => {
              filter.set(
                {
                  subject: Utility.safe(subject)?.toUpperCase(),
                  startAfter: Utility.parseTime(startAfter),
                  startBefore: Utility.parseTime(startBefore),
                  endAfter: Utility.parseTime(endAfter),
                  endBefore: Utility.parseTime(endBefore),
                  meetingDays: Utility.safeArray(meetingDays),
                },
                true
              );
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
