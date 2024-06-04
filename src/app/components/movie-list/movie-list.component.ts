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
  private destroy$: Subject<void> = new Subject<void>();
  movies: IMovie[] = [];
  genres: IGenreMap = {};
  currentPage: number = 1;
  totalPages: number = 500;
  isLoadingMovies: boolean = false;

  constructor(public movieService: MovieService) {}

  ngOnInit(): void {
    // I don't recommend this way of accessing method based on a condition.
    if (this.movieService.searchQuerySubject.value) this.movieService.searchMovies();
    else this.movieService.fetchMovies();

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
      });
  }

  setPreviousSearchQuery = (searchQuery: string): void => {
    this.movieService.previousSearchQuery = searchQuery;
  };

  // onPageChange(page: number): void {
  //   this.movieService.currentPageSubject.next(page);
  //   // I don't recommend this way of accessing method based on a condition.
  //   if (this.movieService.searchQuerySubject.value) this.movieService.searchMovies();
  //   else this.movieService.fetchMovies();
  // }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
