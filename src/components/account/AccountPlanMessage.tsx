function PlansMessage(props) {
    return (
        <div className="flex flex-col justify-center text-center h-4/5 px-8">
            <div className="mx-auto my-2 flex items-center justify-center text-rose-500 dark:text-rose-400">
                {props.icon}
            </div>
            <p className="text-xl font-medium text-rose-500 dark:text-rose-400 m-2">
                {props.title}
            </p>
            <p className="text-sm font-light text-gray-700 dark:text-gray-300 m-2">
                {props.description}
            </p>
            {props.button && (
                <button
                    className="m-2 bg-rose-500 text-white rounded-lg p-2 shadow-lg hover:opacity-75 focus:opacity-60 transition-opacity duration-150"
                    onClick={() => {
                        props.button.action();
                    }}
                >
                    {props.button.text}
                </button>
            )}
        </div>
    );
}

export default PlansMessage;
