import type { $Fetch, NitroFetchRequest } from 'nitropack';

interface IMovie {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
  release_date: string;
  backdrop_path: string;
}

interface IGenre {
  id: number;
  name: string;
}

interface IGenres {
  genres: IGenre[];
}

interface ISelectItem {
  label: string;
  value: string;
}

interface IResult {
  page: number;
  results: IMovie[];
}

const language = 'ru-RU';

export const moviesRepo = <T>(fetch: $Fetch<T, NitroFetchRequest>) => {
  const { $apiAbortController } = useNuxtApp();

  async function getMovies(page: number, genre: string): Promise<IResult> {
    const sort_by = 'popularity.desc';
    const with_genres = genre;
    return fetch(`/discover/movie`, {
      params: {
        sort_by,
        language,
        page,
        with_genres,
      },
    });
  }

  async function getMovieDetails(movie_id: number | string): Promise<IMovie> {
    if ($apiAbortController.value) {
      $apiAbortController.value.abort();
    }

    $apiAbortController.value = new AbortController();
    const signal = $apiAbortController.value.signal;
    return fetch(`movie/${movie_id}`, {
      signal,
    });
  }

  async function getGenreList(): Promise<ISelectItem[]> {
    const data: IGenres = await fetch('genre/movie/list', {
      params: {
        language,
      },
    });
    return data.genres.map((genre) => ({
      label: genre.name,
      value: String(genre.id),
    }));
  }

  return {
    getMovies,
    getMovieDetails,
    getGenreList,
  };
};
