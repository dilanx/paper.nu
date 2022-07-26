import { Color } from '../../types/BaseTypes';

interface SearchButtonProps {
    action: () => void;
    children: string;
    active?: Color;
}

function SearchButton({ action, children, active }: SearchButtonProps) {
    const color = active ?? 'gray';
    return (
        <button
            className={`flex-1 bg-${color}-200 text-${color}-600 font-medium p-1 rounded-lg opacity-60 transition-all duration-150
                hover:opacity-100 active:bg-${color}-300 active:text-${color}-700 active:opacity-100`}
            onClick={() => action()}
        >
            {children}
        </button>
    );
}

export default SearchButton;
