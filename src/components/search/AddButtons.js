import Utility from '../../Utility.js';

function AddButton(props) {
    return (
        <button className={`text-center bg-white dark:bg-gray-800 border-2 border-${props.color}-300 text-${props.color}-300 p-2 block
        mx-auto w-2/3 rounded-md hover:border-${props.color}-500 hover:text-${props.color}-500 dark:hover:border-${props.color}-100 dark:hover:text-${props.color}-100 transition-all duration-150 my-2`} onClick={() => {
            props.action();
        }}>
            {props.text}
        </button>
    )
}

function AddButtonSection(props) {

    let withSummer = (
        <div className="grid grid-cols-4 gap-0">
            <AddButton text="F" color="orange" action={() => {props.action(0);}}/>
            <AddButton text="W" color="red" action={() => {props.action(1);}}/>
            <AddButton text="Sp" color="emerald" action={() => {props.action(2);}}/>
            <AddButton text="Su" color="blue" action={() => {props.action(3);}}/>
        </div>
    )

    let withoutSummer = (
        <div className="grid grid-cols-3 gap-0">
            <AddButton text="Fall" color="orange" action={() => {props.action(0);}}/>
            <AddButton text="Winter" color="red" action={() => {props.action(1);}}/>
            <AddButton text="Spring" color="emerald" action={() => {props.action(2);}}/>
        </div>
    )

    return (
        <div className="py-2">
            <p className="text-center text-gray-500 font-bold p-2 text-sm">
                {props.title}
            </p>
            {props.size === 4 ? withSummer : withoutSummer}
        </div>
    )
}



export default function AddButtons(props) {

    let data = props.data;
    
    let years = data.length;
    
    let sections = [];
    for (let y = 0; y < years; y++) {
        sections.push(<AddButtonSection title={`${Utility.convertYear(y)} YEAR`} size={data[y].length} action={quarter => {props.action(y, quarter);}} key={y}/>);
    }
    

    return (
        <div className="">
            {sections}
        </div>
    )

}