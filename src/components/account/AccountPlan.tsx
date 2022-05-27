import { TrashIcon } from '@heroicons/react/outline';

function AccountPlan(props) {
    return (
        <button
            className="block border-2 border-rose-400 bg-rose-50 dark:bg-gray-800 w-full my-4 text-left px-4 py-8 rounded-lg text-black
            hover:shadow-md transition ease-in-out duration-300 transform hover:-translate-y-1 group
            focus:shadow-inner focus:translate-y-0"
            onClick={() => props.onClick()}
        >
            <p className="text-lg font-semibold text-black dark:text-white">
                {props.name.toUpperCase()}
            </p>
            <p className="text-sm font-light text-gray-600 dark:text-gray-300">
                Last updated{' '}
                {props.lastUpdated
                    ? new Date(props.lastUpdated).toLocaleDateString()
                    : 'N/A'}
            </p>
            <button
                className="absolute -top-2 -right-2 p-0.5 rounded-full bg-gray-200 hover:bg-red-100 dark:bg-gray-700
                        text-gray-500 dark:text-white text-xs opacity-80 hover:text-red-400 dark:hover:text-red-400 hover:opacity-100
                        transition-all duration-150 hidden group-hover:block z-20"
                onClick={e => {
                    e.stopPropagation();
                    props.delPlan();
                }}
            >
                <TrashIcon className="w-5 h-5" />
            </button>
        </button>
    );
}

export default AccountPlan;
