import { useEffect, useState, useRef } from "react";
import Loader from "../Loader";
import ErrorBox from "../Error";
import StarRating from "../StarRating";
import { useKey } from "../../CustomHooks";

const API_KEY = "102887e1";

function MovieDetails({
  onCloseMovie,
  selectedId,
  onAddWatchedMovie,
  watchedMovies,
}) {
  const [movieDetails, setMovieDetails] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [userRating, setUserRating] = useState("");
  const countRef = useRef(0);

  useEffect(
    function () {
      if (userRating) countRef.current++;
    },
    [userRating]
  );

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    Released: released,
    imdbRating,
    Genre: genre,
    Plot: plot,
    Actors: actors,
    Director: director,
  } = movieDetails;

  const WatchedMovieRating = watchedMovies.find(
    (mov) => mov.imdbID === selectedId
  )?.userRating;
  const handleAddWatchedMovie = () => {
    const newMovie = {
      imdbID: selectedId,
      Title: title,
      Year: year,
      Poster: poster,
      runtime: Number(runtime.split(" ")[0]),
      imdbRating: Number(imdbRating),
      userRating: userRating,
      countRatingDecisions: countRef.current,
    };
    onAddWatchedMovie(newMovie);
    onCloseMovie();
  };
  const handleUserRating = (rate) => setUserRating(rate);

  useEffect(() => {
    async function getMovieData() {
      try {
        setError("");
        setIsLoading(true);
        // setMovies({});
        const response = await fetch(
          `https://www.omdbapi.com/?apikey=${API_KEY}&i=${selectedId}`
        );

        const data = await response.json();
        if (!response.ok)
          throw new Error("Something went wrong while fetching Movie Details");
        setMovieDetails(data);
        // console.log(data);
      } catch (error) {
        console.error(error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    }
    if (!selectedId) {
      setError("");
      setIsLoading(false);
      return;
    }
    getMovieData();
  }, [selectedId]);

  useEffect(() => {
    document.title = `Movie | ${title}`;
    return () => (document.title = "FilmFlow");
  }, [title]);

  useKey("Escape", onCloseMovie);

  return (
    <>
      {isLoading && <Loader />}
      {error.length > 0 && <ErrorBox message={error} />}
      {!isLoading && !error.length > 0 && (
        <div className="details">
          <button className="btn-back" onClick={onCloseMovie}>
            &larr;
          </button>
          <header>
            <img src={poster} alt={`${title} poster`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                <span>{released}</span>
                <span>&bull;</span>
                <span>{runtime}</span>
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐️</span> {imdbRating} IMDb rating
              </p>
            </div>
          </header>
          <section>
            <div className="rating">
              {WatchedMovieRating ? (
                <p>
                  You rating for this movie is {WatchedMovieRating}/10
                  <span>⭐</span>
                </p>
              ) : (
                <>
                  <StarRating
                    maxRating={10}
                    size={24}
                    onSetRating={handleUserRating}
                  />
                  {userRating > 0 && (
                    <button className="btn-add" onClick={handleAddWatchedMovie}>
                      Add to list
                    </button>
                  )}
                </>
              )}
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </div>
      )}
    </>
  );
}

export default MovieDetails;
