function Search({ query, setQuery }) {
  return (
    <div className="w-full">
      <input
        type="text" 
        placeholder="Search..."
        value = {query}
        onChange = {(e) => setQuery(e.target.value)}
        className="w-full px-4 py-2 text-sm text-amber-600 bg-gray-100 border border-gray-300 rounded-lg 
                   focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent 
                   dark:bg-white-700 dark:text-amber-600 dark:border-amber-500 dark:placeholder-amber-600"
      />
    </div>
  );
}

export default Search;