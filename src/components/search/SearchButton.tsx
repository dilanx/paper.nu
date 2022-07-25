interface SearchButtonProps {
    action: () => void;
    children: string;
}

function SearchButton({ action, children }: SearchButtonProps) {
    return (
        <button
            className="flex-1 bg-gray-200 text-gray-600 font-medium p-1 rounded-lg opacity-60 transition-all duration-150
                hover:opacity-100 focus:bg-gray-300 focus:text-gray-700 focus:opacity-100"
            onClick={() => action()}
        >
            {children}
        </button>
    );
}

export default SearchButton;
