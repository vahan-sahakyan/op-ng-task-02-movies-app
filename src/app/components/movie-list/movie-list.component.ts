import { Component } from '@angular/core';
import { combineLatest } from 'rxjs';
import { IGenreMap, IMovie } from 'src/app/models/movie/movie.model';
import { MovieService } from 'src/app/services/movie.service';

@Component({
  selector: 'app-movie-list',
  styleUrls: ['./movie-list.component.scss'],
  template: `
    <div class="container mx-auto p-4">
      <div class="mb-4 flex flex-row gap-4 align-middle justify-center">
        <input
          [(ngModel)]="searchQuery"
          placeholder="Search for a movie title"
          class="w-full p-2  border rounded dark:bg-zinc-800 dark:border-zinc-700 dark:placeholder-zinc-400 dark:text-zinc-200"
        />
        <button
          type="submit"
          (click)="onSearch()"
          class="p-2 px-6 text-blue-500 dark:text-zinc-400 hover:text-blue-500 rounded border border-zinc-300 dark:border-zinc-700 hover:border-blue-500"
        >
          Search
        </button>
      </div>
      <div class="empty-results-container ms-2" *ngIf="!movies.length">
        Sorry, no movies with "{{ this.prevSearchQuery }}"
      </div>
      <div class="results-container" *ngIf="movies.length">
        <div class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 gap-y-20 mt-10">
          <app-movie-item *ngFor="let movie of movies" [movie]="movie" [genres]="genres" />
        </div>

        <div *ngIf="totalPages > 1" class="pagination-wrapper">
          <br />
          <br />
          <hr class="dark:border-zinc-700" />
          <app-pagination
            *ngIf="totalPages > 1"
            [currentPage]="currentPage"
            [totalPages]="totalPages"
            (pageChange)="onPageChange($event)"
          ></app-pagination>
        </div>
      </div>
      <!-- Scroll to top -->

      <button
        class="scroll-to-top z-50 fixed bottom-8 right-8 p-3 text-blue-500 dark:text-zinc-400 hover:text-blue-500 rounded-full border border-zinc-300 dark:border-zinc-700 hover:border-blue-500 bg-white dark:bg-zinc-800"
        (click)="scrollToTop()"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="feather feather-arrow-up"
        >
          <line x1="12" y1="19" x2="12" y2="5"></line>
          <polyline points="5 12 12 5 19 12"></polyline>
        </svg>
      </button>
    </div>
  `,
})
export class MovieListComponent {
  movies: IMovie[] = [];
  genres: IGenreMap = {};
  currentPage: number = 1;
  totalPages: number = 500;
  searchQuery: string = '';
  prevSearchQuery: string = '';

  constructor(private movieService: MovieService) {}

  ngOnInit(): void {
    this.getMovies(this.currentPage);
    this.getGenres();
    combineLatest([this.movieService.movies$, this.movieService.genres$]).subscribe(([moviesRes, genresRes]) => {
      this.movies = moviesRes.results;
      this.totalPages = moviesRes.total_pages < 500 ? moviesRes.total_pages : 500;
      console.log(genresRes);
      this.genres = genresRes.genres.reduce((acc, cur) => ({ ...acc, [cur.id]: cur.name }), {});
      console.log(this.genres);
    });
  }

  getMovies(page: number): void {
    this.movieService.fetchMovies(page);
  }
  getGenres(): void {
    this.movieService.fetchGenres();
  }

  onSearch(): void {
    console.log('Search Query:', this.searchQuery);
    if (!this.searchQuery) return this.getMovies(this.currentPage);
    this.movieService.searchMovies({ query: this.searchQuery });
    this.prevSearchQuery = this.searchQuery;
  }
  onSearchKeyPress($event: KeyboardEvent) {
    $event.preventDefault();
    if ($event.key === 'Enter') {
      this.onSearch();
    }
  }
  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  onPageChange(page: number): void {
    this.currentPage = page;
    // smoothly scroll to the top
    if (this.searchQuery) return this.movieService.searchMovies({ query: this.searchQuery, page });
    this.getMovies(page);
  }
}
