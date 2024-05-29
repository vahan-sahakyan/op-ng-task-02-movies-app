import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, delay } from 'rxjs';
import {
  IDetailedMovie,
  IGenre,
  IGenresResponse,
  IMoviesResponse,
  NULL_GENRES_RESP,
  NULL_MVS_RESP,
} from '../models/movie/movie.model';

const REACT_APP_MOVIES_API_KEY = 'f82ecbb7a5110caecaee2bee5e4c79d6';
const FAKE_THROTTLING_FOR_SPINNER = 500;

@Injectable({ providedIn: 'root' })
export class MovieService {
  private apiKey = REACT_APP_MOVIES_API_KEY;
  private baseUrl = `https://api.themoviedb.org/3`;
  private commonParams = { api_key: this.apiKey };

  // CURRENT PAGE
  private currentPageSubject = new BehaviorSubject<number>(1);
  public currentPage$ = this.currentPageSubject.asObservable();
  public getCurrentPage(): number {
    return this.currentPageSubject.value;
  }
  public setCurrentPage(page: number): void {
    this.currentPageSubject.next(page);
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

  // IS LOADING MOVIES
  private isLoadingMoviesSubject = new BehaviorSubject<boolean>(false);
  public isLoadingMovies$ = this.isLoadingMoviesSubject.asObservable();
  public getLoadingMovies(): boolean {
    return this.isLoadingMoviesSubject.value;
  }
  public setIsLoadingMovies(loading: boolean): void {
    this.isLoadingMoviesSubject.next(loading);
  }

  // IS LOADING GENRES
  private isLoadingGenresSubject = new BehaviorSubject<boolean>(false);
  public isLoadingGenres$ = this.isLoadingGenresSubject.asObservable();
  public getLoadingGenres(): boolean {
    return this.isLoadingGenresSubject.value;
  }
  public setIsLoadingGenres(loading: boolean): void {
    this.isLoadingGenresSubject.next(loading);
  }

  // IS LOADING DETAILED MOVIE
  private isLoadingDetailedMovieSubject = new BehaviorSubject<boolean>(false);
  public isLoadingDetailedMovie$ = this.isLoadingDetailedMovieSubject.asObservable();
  public getLoadingDetailedMovie(): boolean {
    return this.isLoadingDetailedMovieSubject.value;
  }
  public setIsLoadingDetailedMovie(loading: boolean): void {
    this.isLoadingDetailedMovieSubject.next(loading);
  }

  constructor(private http: HttpClient) {}

  fetchMovies(): void {
    const params = { ...this.commonParams, page: this.getCurrentPage() };
    this.setIsLoadingMovies(true);
    this.http
      .get<IMoviesResponse>(`${this.baseUrl}/movie/popular`, { params })
      .pipe(delay(FAKE_THROTTLING_FOR_SPINNER))
      .subscribe({
        next: (data) => this.setMovies(data),
        complete: () => this.setIsLoadingMovies(false),
      });
  }
  searchMovies(_params: Record<any, any>): void {
    const params = { ...this.commonParams, ..._params, page: this.getCurrentPage() };
    this.setIsLoadingMovies(true);
    this.http
      .get<IMoviesResponse>(`${this.baseUrl}/search/movie`, { params })
      .pipe(delay(FAKE_THROTTLING_FOR_SPINNER))
      .subscribe({
        next: (data) => this.setMovies(data),
        complete: () => this.setIsLoadingMovies(false),
      });
  }
  fetchMovieById(id: string): void {
    const params = { ...this.commonParams };
    this.setIsLoadingDetailedMovie(true);
    this.http
      .get<IDetailedMovie>(`${this.baseUrl}/movie/${id}`, { params })
      .pipe(delay(FAKE_THROTTLING_FOR_SPINNER))
      .subscribe({
        next: (data) => this.setDetailedMovie(data),
        complete: () => this.setIsLoadingDetailedMovie(false),
      });
  }

  fetchGenres(): void {
    const params = { ...this.commonParams };
    this.setIsLoadingGenres(true);
    this.http.get<{ genres: IGenre[] }>(`${this.baseUrl}/genre/movie/list`, { params }).subscribe({
      next: (res) => this.setGenres(res),
      complete: () => this.setIsLoadingGenres(false),
    });
  }
}
