import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGlobalSearch } from '../../../hooks/useGlobalSearch'; // Pfad anpassen!

const SearchBar: React.FC = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    
    const searchContainerRef = useRef<HTMLDivElement>(null);

    const { data: searchResults, isLoading, isError } = useGlobalSearch(debouncedQuery);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(searchQuery);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setIsOpen(true); 
    };

    const handleResultClick = (url: string) => {
        setIsOpen(false);
        setSearchQuery(''); 
		console.log("Url: ", url)
        navigate(url);
	}

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter' && searchQuery.trim().length > 0) {
			setIsOpen(false);
			navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
		}
	};


 let dropdownContent = null;

    if (debouncedQuery.trim().length === 0) {
        dropdownContent = null;
    } else if (debouncedQuery.trim().length < 2) {
        dropdownContent = (
            <div className="p-3 text-sm text-gray-500 font-kyiv">
                Please type in at least 2 characters...
            </div>
        );
    } else if (isLoading) {
        dropdownContent = <div className="p-3 text-sm text-gray-500 font-kyiv">Searching...</div>;
    } else if (isError) {
        dropdownContent = <div className="p-3 text-sm text-red-500 font-kyiv">Error</div>;
    } else if (!searchResults || searchResults.length === 0) {
        dropdownContent = <div className="p-3 text-sm text-gray-500 font-kyiv">No results found</div>;
    } else {
        dropdownContent = (
            <ul className="flex flex-col">
                {searchResults.map((result) => (
                    <li 
                        key={`${result.type}-${result.id}`} 
                        onClick={() => handleResultClick(result.url)}
                        className="flex justify-between items-center p-3 hover:bg-purple-100 cursor-pointer border-b border-gray-100 last:border-0 transition-colors"
                    >
                        <span className="font-medium text-gray-800 text-sm font-kyiv">
                            {result.title}
                        </span>
                        <span className="text-tag text-purple bg-mild-purple px-2 py-1 rounded-full uppercase">
                            {result.type}
                        </span>
                    </li>
                ))}
            </ul>
        );
    }

    return (
        <div ref={searchContainerRef} className="relative w-full max-w-sm">
            <input
                type="search"
                placeholder="🔎  Search..."
                value={searchQuery}
                className="bg-white px-3 py-2 h-full w-full rounded-lg text-sm text-black focus:outline-purple-500 border border-black"
                onChange={handleSearchChange}
				onKeyDown={handleKeyDown}
                onFocus={() => {
                    if (searchQuery.length > 0) setIsOpen(true);
                }}
            />

            {isOpen && dropdownContent && (
                <div className="absolute top-10 left-0 w-full bg-white border border-gray-200 rounded-md shadow-lg overflow-hidden z-50 max-h-80 overflow-y-auto">
                    {dropdownContent}
                </div>
            )}
        </div>
    );
};

export default SearchBar;
