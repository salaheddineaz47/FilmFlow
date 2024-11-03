import { useState } from "react";
import { useMovies, useLocalStorageState } from "./CustomHooks/";
// import { tempMovieData, tempWatchedData } from "./assets/dummyMovieData";
import { Logo, Results, Search, NavBar } from "./Components/NavBar";
import {
  Main,
  Box,
  Summary,
  WatchedMovies,
  MoviesList,
  Details,
} from "./Components/Main";
import Loader from "./Components/Loader";
import ErrorBox from "./Components/Error";

export default function App() {
  const [query, setQuery] = useState("");
  const [isOpen1, setIsOpen1] = useState(true);
  const [isOpen2, setIsOpen2] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const { movies, isLoading, error } = useMovies(query, handleCloseMovie);
  const [watched, setWatched] = useLocalStorageState([], "watchedMovies");

  function handleSelectMovie(id) {
    setSelectedId((exid) => (exid === id ? null : id));
  }

  function handleCloseMovie() {
    setSelectedId(null);
  }

  function handleAddWatchedMovie(movie) {
    setWatched((watched) =>
      watched.find((mov) => mov.imdbID === movie.imdbID)
        ? [...watched]
        : [...watched, movie]
    );
  }

  function handleDeleteWatchedMovie(movie) {
    setWatched((movies) => movies.filter((mov) => movie !== mov));
  }

  return (
    <>
      <NavBar>
        <Logo>
          <span role="img">🎬</span>
          <h1>FilmFlow</h1>
        </Logo>
        <Search query={query} setQuery={setQuery} />
        <Results movies={movies} />
      </NavBar>

      <Main>
        <Box isOpen={isOpen2} setIsOpen={setIsOpen2}>
          {!error && isLoading && <Loader />}
          {error && !isLoading && <ErrorBox message={error} />}
          {!error && !isLoading && (
            <MoviesList movies={movies} onSelectMovie={handleSelectMovie} />
          )}
        </Box>

        <Box isOpen={isOpen1} setIsOpen={setIsOpen1}>
          {selectedId && (
            <Details
              onCloseMovie={handleCloseMovie}
              selectedId={selectedId}
              onAddWatchedMovie={handleAddWatchedMovie}
              watchedMovies={watched}
            />
          )}
          {!selectedId && (
            <>
              <Summary watched={watched} />
              <WatchedMovies
                watched={watched}
                onDeleteWatchedMovie={handleDeleteWatchedMovie}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}
