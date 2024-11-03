import { useEffect, useRef } from "react";
import { useKey } from "../../CustomHooks";

function Search({ query, setQuery }) {
  const searchInput = useRef(null);

  useEffect(() => searchInput.current.focus(), []);

  useKey("Enter", function () {
    if (document.activeElement === searchInput.current) return;
    searchInput.current.focus();
    setQuery("");
  });

  return (
    <input
      ref={searchInput}
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}

export default Search;
