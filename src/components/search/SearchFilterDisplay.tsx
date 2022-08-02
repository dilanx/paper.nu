import { Color, FilterOptions, SearchFilter } from '../../types/BaseTypes';

interface SearchFilterBadgeProps {
    name: string;
    value: string;
    color: Color;
}

function SearchFilterBadge({ name, value, color }: SearchFilterBadgeProps) {
    return (
        <button className={`flex text-xs rounded-lg overflow-hidden`}>
            <p className={`px-1 py-0.5 bg-${color}-500 text-white`}>{name}</p>
            <p
                className={`px-1 py-0.5 bg-${color}-100 text-${color}-500 font-bold`}
            >
                {value}
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
        badges.push(
            <SearchFilterBadge
                name={f}
                value={filter.get[f as keyof FilterOptions] as string}
                color="blue"
                key={`filter-badge-${f}`}
            />
        );
    }
    return <div className="flex gap-2 justify-center">{badges}</div>;
}

export default SearchFilterDisplay;
