import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, combineLatest, takeUntil } from 'rxjs';
import { IGenreMap, IMovie } from 'src/app/models/movie/movie.model';
import { MovieService } from 'src/app/services/movie.service';

@Component({
  selector: 'app-movie-list',
  styleUrls: ['./movie-list.component.scss'],
  template: `
    <div class="container mx-auto p-4">
      <app-search-section
        (search)="handleSearch()"
        (resetSearch)="handleSearchReset()"
        (searchKeyPress)="handleSearchKeyPress($event)"
        [setPreviousSearchQuery]="setPreviousSearchQuery"
      />

      <div *ngIf="totalPages > 1" class="pagination-wrapper">
        <br />
        <br />
        <hr class="dark:border-zinc-700" />
        <app-pagination
          *ngIf="totalPages > 1"
          [totalPages]="totalPages"
          [currentPage]="currentPage"
          (pageChange)="onPageChange($event)"
        ></app-pagination>
      </div>

      <app-no-results [text]="prevSearchQuery" *ngIf="!movies.length && !isLoadingMovies" />

      <div class="results-container" *ngIf="movies.length">
        <div
          class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 gap-y-44 mt-10 mb-44"
        >
          <app-movie-item *ngFor="let movie of movies" [movie]="movie" [genres]="genres" />
        </div>

        <div *ngIf="totalPages > 1" class="pagination-wrapper">
          <br />
          <br />
          <hr class="dark:border-zinc-700" />
          <app-pagination
            *ngIf="totalPages > 1"
            [totalPages]="totalPages"
            [currentPage]="currentPage"
            (pageChange)="onPageChange($event)"
          ></app-pagination>
        </div>
      </div>
      <app-scroll-up (scrollUp)="scrollToTop()" />
    </div>
  `,
})
export class MovieListComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  movies: IMovie[] = [];
  genres: IGenreMap = {};
  currentPage: number = 1;
  totalPages: number = 500;
  searchQuery: string = '';
  prevSearchQuery: string = '';
  isLoadingMovies: boolean = false;

  constructor(private movieService: MovieService) {}

  ngOnInit(): void {
    this.movieService[this.movieService.getSearchQuery() ? 'searchMovies' : 'fetchMovies']();
    this.movieService.fetchGenres();

    combineLatest([
      this.movieService.movies$,
      this.movieService.genres$,
      this.movieService.isLoadingMovies$,
      this.movieService.currentPage$,
      this.movieService.searchQuery$,
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([moviesRes, genresRes, isLoadingMovies, currentPage, searchQuery]) => {
        this.movies = moviesRes.results;
        this.totalPages = moviesRes.total_pages < 500 ? moviesRes.total_pages : 500;
        this.genres = genresRes.genres.reduce((acc, cur) => ({ ...acc, [cur.id]: cur.name }), {});
        this.isLoadingMovies = isLoadingMovies;
        this.currentPage = currentPage;
        this.searchQuery = searchQuery;
      });
  }

  handleSearch(): void {
    if (!this.searchQuery) return this.movieService.fetchMovies();
    this.movieService.setCurrentPage(1);
    this.movieService.searchMovies();
    this.setPreviousSearchQuery(this.searchQuery);
  }

  setPreviousSearchQuery = (searchQuery: string): void => {
    this.prevSearchQuery = searchQuery;
  };

  handleSearchKeyPress(event: KeyboardEvent) {
    event.preventDefault();
    if (this.prevSearchQuery === this.searchQuery) return;
    if (event.key === 'Enter') this.handleSearch();
  }

  handleSearchReset() {
    this.movieService.setSearchQuery('');
    this.movieService.setCurrentPage(1);
    this.handleSearch();
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onPageChange(page: number): void {
    this.movieService.setCurrentPage(page);
    this.movieService[this.searchQuery ? 'searchMovies' : 'fetchMovies']();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
