import { useEffect } from "react";

export function useKey(key, action) {
  //
  useEffect(() => {
    const callback = function (e) {
      if (e.code.toLowerCase() === key.toLowerCase()) action();
    };
    const closeMovieEvent = document.addEventListener("keydown", callback);

    return function () {
      document.removeEventListener(closeMovieEvent, callback);
    };
  }, [action, key]);
}
