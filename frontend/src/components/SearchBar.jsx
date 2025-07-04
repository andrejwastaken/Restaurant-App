import { NavLink } from "react-router-dom";
import Logo from "./Logo";
import Search from "./Search";

function SearchBar({ query, setQuery }) {
  return (
    <header className="bg-gradient-to-r from-white to-amber-50 dark:from-amber-500 dark:to-amber-600 shadow-lg border-b border-amber-100 dark:border-amber-400 sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0 lg:space-x-8">
          <div className="flex items-center space-x-6">
            <div className="flex-shrink-0">
              <Logo />
            </div>

            <div className="flex bg-white dark:bg-amber-400 rounded-lg p-1 shadow-sm border border-amber-200 dark:border-amber-300">
              <NavLink
                to="map-view"
                className={({ isActive }) =>
                  `px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-offset-1 ${
                    isActive
                      ? "bg-amber-500 text-white shadow-sm transform scale-[0.98]"
                      : "text-amber-700 hover:bg-amber-100 dark:text-amber-900 dark:hover:bg-amber-400"
                  }`
                }
              >
                Map View
              </NavLink>
              <NavLink
                to="list-view"
                className={({ isActive }) =>
                  `px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-offset-1 ${
                    isActive
                      ? "bg-amber-500 text-white shadow-sm transform scale-[0.98]"
                      : "text-amber-700 hover:bg-amber-100 dark:text-amber-900 dark:hover:bg-amber-400"
                  }`
                }
              >
                List View
              </NavLink>
            </div>
          </div>

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
