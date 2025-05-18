import Logo from "./Logo";
import Search from "./Search";

function SearchBar({ query, setQuery }) {
  return (
    <header className="bg-white dark:bg-amber-500 shadow-md sticky">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-6">

          <div className="flex-shrink-0">
            <Logo />
          </div>

          <div className="w-full md:w-auto md:flex-grow md:max-w-lg lg:max-w-xl">
            {/*
              - w-full: Full width on small screens (when flex-col is active).
              - md:w-auto: Auto width on medium screens and up (content-based).
              - md:flex-grow: Allows the search area to expand and fill available space on medium screens and up.
              - md:max-w-lg / lg:max-w-xl: Sets a maximum width for the search bar on larger screens to prevent it from becoming too wide. Adjust as needed.
            */}
            <Search query={query} setQuery={setQuery}/>
          </div>
        </div>
      </div>
    </header>
  );
}

export default SearchBar;