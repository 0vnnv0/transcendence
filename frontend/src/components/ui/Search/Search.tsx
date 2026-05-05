import React, { useState } from 'react'

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
                className="bg-white h-10 px-3 w-full rounded-full text-sm focus:outline-none"
                onChange={handleSearchChange}
            />
        </div>
    );
};

export default SearchBar;