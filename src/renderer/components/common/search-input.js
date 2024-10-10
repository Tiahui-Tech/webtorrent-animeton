const React = require('react');
const { Icon } = require('@iconify/react');

const SearchInput = ({ searchTerm, setSearchTerm }) => {
    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleClear = () => {
        setSearchTerm('');
    };

    return (
        <div className="relative inline-block" style={{ WebkitAppRegion: 'no-drag', zIndex: 9999 }}>
            <input
                type="text"
                className="h-10 py-2 pl-8 pr-10 w-64 text-white placeholder-white placeholder-opacity-70 rounded-full focus:outline-none focus:ring-0"
                placeholder="Buscar"
                value={searchTerm}
                onChange={handleSearch}
            />
            <Icon
                icon="gravity-ui:magnifier"
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white"
            />
            {searchTerm && (
                <button
                    onClick={handleClear}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white focus:outline-none"
                >
                    <Icon icon="mdi:close" />
                </button>
            )}
        </div>
    );
};

module.exports = SearchInput;
