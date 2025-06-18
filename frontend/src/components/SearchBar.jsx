import Logo from "./Logo";
import Search from "./Search";

function SearchBar({ query, setQuery, isListSelected, setListSelected }) {
  return (
    <header className="bg-gradient-to-r from-white to-amber-50 dark:from-amber-500 dark:to-amber-600 shadow-lg border-b border-amber-100 dark:border-amber-400 sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0 lg:space-x-8">
          
          {/* Logo and View Toggle Section */}
          <div className="flex items-center space-x-6">
            <div className="flex-shrink-0">
              <Logo />
            </div>
            
            <div className="flex bg-white dark:bg-amber-400 rounded-lg p-1 shadow-sm border border-amber-200 dark:border-amber-300">
              <button
                onClick={() => setListSelected(false)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  !isListSelected
                    ? "bg-amber-500 text-white shadow-sm transform scale-[0.98]"
                    : "text-amber-700 hover:bg-amber-100 dark:text-amber-800 dark:hover:bg-amber-300"
                } focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-offset-1`}
              >
                Map View
              </button>
              <button
                onClick={() => setListSelected(true)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  isListSelected
                    ? "bg-amber-500 text-white shadow-sm transform scale-[0.98]"
                    : "text-amber-700 hover:bg-amber-100 dark:text-amber-800 dark:hover:bg-amber-300"
                } focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-offset-1`}
              >
                List View
              </button>
            </div>
          </div>

          {/* Search Section */}
          <div className="w-full lg:w-auto lg:flex-grow lg:max-w-md xl:max-w-lg">
            <div className="relative">
              <Search query={query} setQuery={setQuery} />
            </div>
          </div>
          
        </div>
      </div>
    </header>
  );
}

export default SearchBar;