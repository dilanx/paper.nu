function AddButton(props) {
    return (
        <button className={`text-center bg-white border-2 border-${props.color}-300 text-${props.color}-300 p-2 block
        mx-auto w-2/3 rounded-md hover:border-${props.color}-500 hover:text-${props.color}-500 transition-all duration-150 my-2`} onClick={() => {
            props.action();
        }}>
            {props.text}
        </button>
    )
}

function AddButtonSection(props) {
    return (
        <div className="py-2">
            <p className="text-center text-gray-500 font-bold p-2 text-sm">
                {props.title}
            </p>
            <div className="grid grid-cols-3 gap-0">
                <AddButton text="Fall" color="orange" action={() => {props.action(0);}}/>
                <AddButton text="Winter" color="red" action={() => {props.action(1);}}/>
                <AddButton text="Spring" color="emerald" action={() => {props.action(2);}}/>
            </div>
        </div>
    )
}



export default function AddButtons(props) {

    return (
        <div className="">
            <AddButtonSection title="FIRST YEAR" action={quarter => {props.action(0, quarter);}}/>
            <AddButtonSection title="SECOND YEAR" action={quarter => {props.action(1, quarter);}}/>
            <AddButtonSection title="THIRD YEAR" action={quarter => {props.action(2, quarter);}}/>
            <AddButtonSection title="FOURTH YEAR" action={quarter => {props.action(3, quarter);}}/>
        </div>
    )

}