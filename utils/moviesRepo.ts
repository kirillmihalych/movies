import type { $Fetch, NitroFetchRequest } from 'nitropack';

interface IMovie {
  id: number;
  title: string;
}

interface IResult {
  page: number;
  results: IMovie[];
}

export const moviesRepo = <T>(fetch: $Fetch<T, NitroFetchRequest>) => ({
  async getMovies(): Promise<IResult> {
    return fetch(
      '/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc'
    );
  },
  async getMovieDetails(movie_id: string): Promise<IMovie> {
    return fetch(`https://api.themoviedb.org/3/movie/${movie_id}`);
  },
});
