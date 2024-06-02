import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import {
  IDetailedMovie,
  IGenre,
  IGenresResponse,
  IMoviesResponse,
  NULL_GENRES_RESP,
  NULL_MVS_RESP,
} from '../models/movie/movie.model';

// put types to all variables and the type of methods return.
// put docs to all the methods.
// if there is no custom logic for the getters and setters (exposing the subjects) then you can just remove them and deal the subjects directly.

const REACT_APP_MOVIES_API_KEY = 'f82ecbb7a5110caecaee2bee5e4c79d6';
@Injectable({ providedIn: 'root' })
export class MovieService {
  private apiKey = REACT_APP_MOVIES_API_KEY;
  private baseUrl = `https://api.themoviedb.org/3`;
  private commonParams = { api_key: this.apiKey };
  isLoadingMoviesService: boolean = false;

  // CURRENT PAGE
  private currentPageSubject = new BehaviorSubject<number>(1);
  public currentPage$ = this.currentPageSubject.asObservable();
  public getCurrentPage(): number {
    return this.currentPageSubject.value;
  }
  public setCurrentPage(page: number): void {
    this.currentPageSubject.next(page);
  }

  // SEARCH QUERY
  private searchQuerySubject = new BehaviorSubject<string>('');
  public searchQuery$ = this.searchQuerySubject.asObservable();
  public getSearchQuery(): string {
    return this.searchQuerySubject.value;
  }
  public setSearchQuery(searchQuery: string): void {
    this.searchQuerySubject.next(searchQuery);
  }

  // MOVIES
  private moviesSubject = new BehaviorSubject<IMoviesResponse>(NULL_MVS_RESP);
  public movies$ = this.moviesSubject.asObservable();
  public getMovies(): IMoviesResponse {
    return this.moviesSubject.value;
  }
  public setMovies(moviesResponse: IMoviesResponse): void {
    this.moviesSubject.next(moviesResponse);
  }

  // GENRES
  private genresSubject = new BehaviorSubject<IGenresResponse>(NULL_GENRES_RESP);
  public genres$ = this.genresSubject.asObservable();
  public getGenres(): IGenresResponse {
    return this.genresSubject.value;
  }
  public setGenres(genresResponse: IGenresResponse): void {
    this.genresSubject.next(genresResponse);
  }

  // DETAILED MOVIE
  private detailedMovieSubject = new BehaviorSubject<IDetailedMovie | undefined>(undefined);
  public detailedMovie$ = this.detailedMovieSubject.asObservable();
  public getDetailedMovie(): IDetailedMovie | undefined {
    return this.detailedMovieSubject.value;
  }
  public setDetailedMovie(detailedMovie: IDetailedMovie | undefined): void {
    this.detailedMovieSubject.next(detailedMovie);
  }

  constructor(private http: HttpClient) {}

  fetchMovies(): void {
    const params = { ...this.commonParams, page: this.getCurrentPage() };
    this.isLoadingMoviesService = true;
    this.http.get<IMoviesResponse>(`${this.baseUrl}/movie/popular`, { params }).subscribe({
      next: (data) => this.setMovies(data),
      complete: () => this.isLoadingMoviesService = false,
    });
  }
  searchMovies(_params = {}): void {
    const params = {
      ...this.commonParams,
      page: this.getCurrentPage(),
      query: this.getSearchQuery(),
      ..._params,
    };
    this.isLoadingMoviesService = true;
    this.http.get<IMoviesResponse>(`${this.baseUrl}/search/movie`, { params }).subscribe({
      next: (data) => this.setMovies(data),
      complete: () => this.isLoadingMoviesService = false,
    });
  }
  fetchMovieById(id: string): void {
    const params = { ...this.commonParams };
    this.isLoadingMoviesService = true;
    this.http.get<IDetailedMovie>(`${this.baseUrl}/movie/${id}`, { params }).subscribe({
      next: (data) => this.setDetailedMovie(data),
      complete: () => this.isLoadingMoviesService = false,
    });
  }

  fetchGenres(): void {
    const params = { ...this.commonParams };
    this.isLoadingMoviesService = true;
    this.http.get<{ genres: IGenre[] }>(`${this.baseUrl}/genre/movie/list`, { params }).subscribe({
      next: (res) => this.setGenres(res),
      complete: () => this.isLoadingMoviesService = false,
    });
  }
}
