const React = require('react');
const { Icon } = require('@iconify/react');

const SearchInput = ({ searchTerm, setSearchTerm }) => {
    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    return (
        <div className="relative inline-block">
            <input
                type="text"
                className="h-10 py-2 pl-8 pr-4 w-64 text-white placeholder-white placeholder-opacity-70 rounded-full focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                placeholder="Buscar"
                value={searchTerm}
                onChange={handleSearch}
            />
            <Icon
                icon="gravity-ui:magnifier"
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white"
            />
        </div>
    );
};

module.exports = SearchInput;
