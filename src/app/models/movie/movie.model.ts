export interface IMovie {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export interface IMoviesResponse {
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}

export const NULL_MVS_RESP = {
  page: 0,
  results: [],
  total_pages: 0,
  total_results: 0,
};

export interface IGenre {
  id: number;
  name: string;
}

export interface IGenreMap {
  [key: IGenre['id']]: IGenre['name'];
}

export interface IGenresResponse {
  genres: IGenre[];
}

export const NULL_GENRES_RESP = {
  genres: [],
};
