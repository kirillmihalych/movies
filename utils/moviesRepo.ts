import type { $Fetch, NitroFetchRequest } from 'nitropack';

interface IMovie {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
  release_date: string;
  backdrop_path: string;
}

interface IResult {
  page: number;
  results: IMovie[];
}

export const moviesRepo = <T>(fetch: $Fetch<T, NitroFetchRequest>) => {
  const { $apiAbortController } = useNuxtApp();

  async function getMovies(page: number): Promise<IResult> {
    return fetch(
      `/discover/movie?include_adult=false&include_video=false&language=en-US&sort_by=popularity.desc`,
      {
        params: {
          page,
        },
      }
    );
  }

  async function getMovieDetails(movie_id: string): Promise<IMovie> {
    if ($apiAbortController.value) {
      $apiAbortController.value.abort();
    }

    $apiAbortController.value = new AbortController();
    const signal = $apiAbortController.value.signal;
    return fetch(`movie/${movie_id}`, {
      signal,
    });
  }

  return {
    getMovies,
    getMovieDetails,
  };
};
