import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { IGenre, IGenresResponse, IMoviesResponse, NULL_GENRES_RESP, NULL_MVS_RESP } from '../models/movie/movie.model';

const REACT_APP_MOVIES_API_KEY = 'f82ecbb7a5110caecaee2bee5e4c79d6';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};
@Injectable({ providedIn: 'root' })
export class MovieService {
  private apiKey = REACT_APP_MOVIES_API_KEY;
  private baseUrl = `https://api.themoviedb.org/3`;

  private moviesSubject = new BehaviorSubject<IMoviesResponse>(NULL_MVS_RESP);
  public movies$ = this.moviesSubject.asObservable();

  private genresSubject = new BehaviorSubject<IGenresResponse>(NULL_GENRES_RESP);
  public genres$ = this.genresSubject.asObservable();

  private commonParams = { api_key: this.apiKey };

  constructor(private http: HttpClient) {}

  fetchMovies(page: number): void {
    const params = { ...this.commonParams, page };
    this.http
      .get<IMoviesResponse>(`${this.baseUrl}/movie/popular`, { params })
      .subscribe((data) => this.moviesSubject.next(data));
  }

  // fetch genres
  fetchGenres(): void {
    const params = { ...this.commonParams };
    this.http
      .get<{ genres: IGenre[] }>(`${this.baseUrl}/genre/movie/list`, { params })
      .subscribe((res) => this.genresSubject.next(res));
  }
}
