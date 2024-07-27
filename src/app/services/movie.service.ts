import { Injectable } from '@angular/core';

import { HttpClient, HttpParams } from '@angular/common/http';
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

const MOVIES_API_KEY = 'f82ecbb7a5110caecaee2bee5e4c79d6';
@Injectable({ providedIn: 'root' })
export class MovieService {
  private apiKey: string = MOVIES_API_KEY;
  private baseUrl: string = `https://api.themoviedb.org/3`;
  private commonParams: Record<string, string> = { api_key: this.apiKey };
  isLoadingMoviesService: boolean = false;
  previousSearchQuery: string = '';

  // CURRENT PAGE
  public currentPageSubject = new BehaviorSubject<number>(1);
  public currentPage$ = this.currentPageSubject.asObservable();

  // SEARCH QUERY
  public searchQuerySubject = new BehaviorSubject<string>('');
  public searchQuery$ = this.searchQuerySubject.asObservable();

  // MOVIES
  public moviesSubject = new BehaviorSubject<IMoviesResponse>(NULL_MVS_RESP);
  public movies$ = this.moviesSubject.asObservable();

  // GENRES
  public genresSubject = new BehaviorSubject<IGenresResponse>(NULL_GENRES_RESP);
  public genres$ = this.genresSubject.asObservable();

  // DETAILED MOVIE
  public detailedMovieSubject = new BehaviorSubject<IDetailedMovie | undefined>(undefined);
  public detailedMovie$ = this.detailedMovieSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Http Requests
  fetchMovies(): void {
    const params = { ...this.commonParams, page: this.currentPageSubject.value };
    this.isLoadingMoviesService = true;
    this.http.get<IMoviesResponse>(`${this.baseUrl}/movie/popular`, { params }).subscribe({
      next: (data) => this.moviesSubject.next(data),
      complete: () => (this.isLoadingMoviesService = false),
    });
  }
  searchMovies(_params = {}): void {
    const params = {
      ...this.commonParams,
      page: this.currentPageSubject.value,
      query: this.searchQuerySubject.value,
      ..._params,
    };
    this.isLoadingMoviesService = true;
    this.http.get<IMoviesResponse>(`${this.baseUrl}/search/movie`, { params }).subscribe({
      next: (data) => this.moviesSubject.next(data),
      complete: () => (this.isLoadingMoviesService = false),
    });
  }
  fetchMovieById(id: string): void {
    const params = { ...this.commonParams };
    this.isLoadingMoviesService = true;
    this.http.get<IDetailedMovie>(`${this.baseUrl}/movie/${id}`, { params }).subscribe({
      next: (data) => this.detailedMovieSubject.next(data),
      complete: () => (this.isLoadingMoviesService = false),
    });
  }

  fetchGenres(): void {
    const params = { ...this.commonParams };
    this.http.get<{ genres: IGenre[] }>(`${this.baseUrl}/genre/movie/list`, { params }).subscribe({
      next: (res) => this.genresSubject.next(res),
    });
  }

  // Handlers
  handleSearch(): void {
    this.previousSearchQuery = this.searchQuerySubject.value;
    if (!this.searchQuerySubject.value) return this.fetchMovies();
    this.currentPageSubject.next(1);
    this.searchMovies();
  }
  handleSearchReset(): void {
    this.searchQuerySubject.next('');
    this.currentPageSubject.next(1);
    this.handleSearch();
  }
  handleSearchKeyPress(event: KeyboardEvent) {
    event.preventDefault();
    if (this.previousSearchQuery === this.searchQuerySubject.value) return;
    if (event.key === 'Enter') this.handleSearch();
  }
  handlePageChange(page: number): void {
    this.currentPageSubject.next(page);
    // I don't recommend this way of accessing method based on a condition.
    if (this.searchQuerySubject.value) this.searchMovies();
    else this.fetchMovies();
  }
}
