import React, { useState } from 'react'

interface SearchBarProps {
    className?: string
}

const SearchBar: React.FC= () => {
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    return (
        <div>
            <input
                type="search"
                placeholder="🔎  Search..."
                value={searchQuery}
                className="bg-white h-8 px-3 w-36 rounded-full text-sm focus:outline-green-700"
                onChange={handleSearchChange}
            />
        </div>
    );
};

export default SearchBar;