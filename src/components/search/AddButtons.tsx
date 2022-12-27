import { Color } from '../../types/BaseTypes';
import { Course } from '../../types/PlanTypes';
import Utility from '../../utility/Utility';

interface AddButtonProps {
  color: Color;
  action: () => void;
  text: string;
}

function AddButton(props: AddButtonProps) {
  return (
    <button
      className={`text-center bg-${props.color}-400 mx-auto my-2 block w-2/3
        rounded-md p-2 font-medium text-white opacity-100 shadow-sm hover:opacity-60`}
      onClick={() => {
        props.action();
      }}
    >
      {props.text}
    </button>
  );
}

interface AddButtonSectionProps {
  title: string;
  size: number;
  action: (quarter: number) => void;
}

function AddButtonSection(props: AddButtonSectionProps) {
  let withSummer = (
    <div className="grid grid-cols-4 gap-0">
      <AddButton
        text="Fa"
        color="orange"
        action={() => {
          props.action(0);
        }}
      />
      <AddButton
        text="Wi"
        color="sky"
        action={() => {
          props.action(1);
        }}
      />
      <AddButton
        text="Sp"
        color="lime"
        action={() => {
          props.action(2);
        }}
      />
      <AddButton
        text="Su"
        color="yellow"
        action={() => {
          props.action(3);
        }}
      />
    </div>
  );

  let withoutSummer = (
    <div className="grid grid-cols-3 gap-0">
      <AddButton
        text="Fall"
        color="orange"
        action={() => {
          props.action(0);
        }}
      />
      <AddButton
        text="Winter"
        color="sky"
        action={() => {
          props.action(1);
        }}
      />
      <AddButton
        text="Spring"
        color="lime"
        action={() => {
          props.action(2);
        }}
      />
    </div>
  );

  return (
    <div className="py-2">
      <p className="p-2 text-center text-sm font-bold text-gray-500">
        {props.title}
      </p>
      {props.size === 4 ? withSummer : withoutSummer}
    </div>
  );
}

interface AddButtonsProps {
  courses: Course[][][];
  action: (year: number, quarter: number) => void;
}

function AddButtons(props: AddButtonsProps) {
  let courses = props.courses;
  let years = courses.length;

  let sections = [];
  for (let y = 0; y < years; y++) {
    sections.push(
      <AddButtonSection
        title={Utility.convertYear(y)}
        size={courses[y].length}
        action={(quarter) => {
          props.action(y, quarter);
        }}
        key={y}
      />
    );
  }

  return <div>{sections}</div>;
}

export default AddButtons;
