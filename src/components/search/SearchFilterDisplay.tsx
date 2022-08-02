import { XIcon } from '@heroicons/react/outline';
import { FilterOptions, SearchFilter } from '../../types/BaseTypes';
import Utility from '../../utility/Utility';

interface SearchFilterBadgeProps {
    name: keyof FilterOptions;
    value: string;
    remove: () => void;
}

function SearchFilterBadge({ name, value, remove }: SearchFilterBadgeProps) {
    const color = Utility.getFilterColor(name);
    return (
        <button
            className="flex text-xs rounded-lg overflow-hidden group relative shadow-sm"
            onClick={() => remove()}
        >
            <p className={`px-1 py-0.5 bg-${color}-500 text-white`}>{name}</p>
            <p
                className={`px-1 py-0.5 bg-${color}-100 dark:bg-gray-600 text-${color}-500 dark:text-${color}-300 font-bold`}
            >
                {value}
            </p>
            <p
                className="absolute top-0 left-0 w-full h-full text-white bg-blue-400
                    rounded-lg hidden group-hover:flex justify-center items-center bg-opacity-80 group-active:bg-opacity-100"
            >
                <XIcon className="w-4 h-4" />
            </p>
        </button>
    );
}

interface SearchFilterDisplayProps {
    filter: SearchFilter;
}

function SearchFilterDisplay({ filter }: SearchFilterDisplayProps) {
    const badges = [];
    for (const f in filter.get) {
        const name = f as keyof FilterOptions;
        badges.push(
            <SearchFilterBadge
                name={name}
                value={filter.get[name] as string}
                remove={() => filter.remove(name)}
                key={`filter-badge-${f}`}
            />
        );
    }
    return <div className="flex gap-2 justify-center">{badges}</div>;
}

export default SearchFilterDisplay;
