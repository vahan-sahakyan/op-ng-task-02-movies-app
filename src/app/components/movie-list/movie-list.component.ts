import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, combineLatest, takeUntil } from 'rxjs';
import { IGenreMap, IMovie } from 'src/app/models/movie/movie.model';
import { MovieService } from 'src/app/services/movie.service';

// this component should be only responsible for viewing the results.
// move out the pagination the search and the pagination logic.

@Component({
  selector: 'app-movie-list',
  styleUrls: ['./movie-list.component.scss'],
  templateUrl: './movie-list.component.html',
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
    // I don't recommend this way of accessing method based on a condition.
    this.movieService[this.searchQuery ? 'searchMovies' : 'fetchMovies']();
    this.movieService[this.movieService.getSearchQuery() ? 'searchMovies' : 'fetchMovies']();

    this.movieService.fetchGenres();

    combineLatest([
      this.movieService.movies$,
      this.movieService.genres$,
      this.movieService.currentPage$,
      this.movieService.searchQuery$,
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([moviesRes, genresRes, currentPage, searchQuery]) => {
        this.movies = moviesRes.results;
        this.totalPages = moviesRes.total_pages < 500 ? moviesRes.total_pages : 500;
        this.genres = genresRes.genres.reduce((acc, cur) => ({ ...acc, [cur.id]: cur.name }), {});
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

  // I guess you should move this method to its component (scroll-up.component.ts).
  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onPageChange(page: number): void {
    this.movieService.setCurrentPage(page);

    // I don't recommend this way of accessing method based on a condition.
    this.movieService[this.searchQuery ? 'searchMovies' : 'fetchMovies']();
    // this.searchQuery ? this.movieService.searchMovies() : this.movieService.fetchMovies();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
