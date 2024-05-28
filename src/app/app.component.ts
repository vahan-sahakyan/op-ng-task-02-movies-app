import { Component, OnDestroy, OnInit } from '@angular/core';
import { MovieService } from './services/movie.service';
import { Subject, combineLatest, takeUntil } from 'rxjs';
import { IGenre, IGenreMap, IMovie } from './models/movie/movie.model';

@Component({
  selector: 'app-root',
  styleUrls: ['./app.component.scss'],
  template: `
    <div class="min-h-screen py-20 px-10 dark:bg-zinc-900 dark:text-zinc-200">
      <div class="container mx-auto p-4">
        <input
          (input)="onSearch()"
          placeholder="Search for a movie title"
          class="w-full p-2 mb-4 border rounded dark:bg-zinc-800 dark:border-zinc-700 dark:placeholder-zinc-400 dark:text-zinc-200"
        />
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div *ngFor="let movie of movies" class="movie-item bg-white p-4 rounded shadow dark:bg-zinc-800">
            <img
              [src]="'https://image.tmdb.org/t/p/w500/' + movie.poster_path"
              alt="{{ movie.title }}"
              class="w-full h-auto mb-4 rounded"
            />
            <h3 class="text-lg font-semibold mb-2 dark:text-zinc-200">
              {{ movie.title }}
            </h3>
            <p class="mb-2 dark:text-zinc-400">Rating: {{ movie.vote_average }}</p>
            <p class="mb-4 dark:text-zinc-400">Release Date: {{ movie.release_date }}</p>
            <div class="text-sm font-semibold mb-2 dark:text-zinc-400">
              {{ genres[movie.genre_ids[0]] }}
            </div>
            <a [routerLink]="['/movie', movie.id]" class="text-blue-500 hover:underline dark:text-blue-400"
              >View Details</a
            >
          </div>
        </div>
        <app-pagination
          [currentPage]="currentPage"
          [totalPages]="totalPages"
          (pageChange)="onPageChange($event)"
        ></app-pagination>
      </div>
    </div>
  `,
})
export class AppComponent implements OnInit {
  movies: IMovie[] = [];
  genres: IGenreMap = {};
  currentPage: number = 1;
  totalPages: number = 0;
  searchQuery: string = '';

  constructor(private movieService: MovieService) {}

  ngOnInit(): void {
    this.movieService.fetchMovies(1);
    this.getMovies(this.currentPage);
  }

  getMovies(page: number): void {
    combineLatest([this.movieService.movies$, this.movieService.genres$]).subscribe(([moviesRes, genresRes]) => {
      this.movies = moviesRes.results;
      this.totalPages = moviesRes.total_pages;
      this.genres = genresRes.genres.reduce((acc, cur) => ({ ...acc, [cur.id]: cur.name }), {});
    });
  }

  onSearch(): void {
    if (this.searchQuery.trim() === '') {
      this.getMovies(this.currentPage);
    } else {
      this.movies = this.movies.filter((movie) => movie.title.toLowerCase().includes(this.searchQuery.toLowerCase()));
    }
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.getMovies(page);
  }
}
