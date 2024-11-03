import { useState, useEffect } from "react";
const API_KEY = "102887e1";

export function useMovies(query, callback) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    callback?.();

    const controller = new AbortController();
    const signal = controller.signal;

    async function fetchMovies() {
      try {
        setError("");
        setIsLoading(true);

        const response = await fetch(
          `http://www.omdbapi.com/?apikey=${API_KEY}&s=${query}`,
          { signal }
        );

        if (!response.ok)
          throw new Error("Something went wrong while fetching Movies");

        const data = await response.json();
        if (data.Response === "False") throw new Error("Movie Not Found");

        setMovies(data.Search);
        setError("");
      } catch (error) {
        if (error.name !== "AbortError") {
          console.log(error);
          setError(error.message);
        }
      } finally {
        setIsLoading(false);
      }
    }

    if (query.length < 3) {
      setError("");
      setMovies([]);
      return;
    }
    fetchMovies();

    return function () {
      controller.abort();
    };
  }, [query]);

  return { movies, isLoading, error };
}
