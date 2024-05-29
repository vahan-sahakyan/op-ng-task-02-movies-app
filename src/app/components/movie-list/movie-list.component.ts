import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { combineLatest } from 'rxjs';
import { IGenreMap, IMovie } from 'src/app/models/movie/movie.model';
import { MovieService } from 'src/app/services/movie.service';

@Component({
  selector: 'app-movie-list',
  styleUrls: ['./movie-list.component.scss'],
  template: `
    <div class="container mx-auto p-4">
      <app-search-section
        (search)="handleSearch($event)"
        (searchKeyPress)="handleSearchKeyPress($event)"
        [setPreviousSearchQuery]="setPreviousSearchQuery.bind(this)"
        [setSearchQuery]="setSearchQuery.bind(this)"
      />
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
            [currentPage]="currentPage"
            [totalPages]="totalPages"
            (pageChange)="onPageChange($event)"
          ></app-pagination>
        </div>
      </div>
      <app-scroll-up (scrollUp)="scrollToTop()" />
    </div>
  `,
})
export class MovieListComponent implements OnInit, OnDestroy, AfterViewInit {
  movies: IMovie[] = [];
  genres: IGenreMap = {};
  currentPage: number = 1;
  totalPages: number = 500;
  searchQuery: string = ''; // FIXME: into service
  prevSearchQuery: string = ''; // FIXME: into service
  isLoadingMovies: boolean = false;
  constructor(private movieService: MovieService) {}
  ngAfterViewInit(): void {}

  ngOnInit(): void {
    this.getMovies();
    this.getGenres();

    combineLatest([
      this.movieService.movies$,
      this.movieService.genres$,
      this.movieService.isLoadingMovies$,
      this.movieService.currentPage$,
    ]).subscribe(([moviesRes, genresRes, isLoadingMovies, currentPage]) => {
      this.movies = moviesRes.results;
      this.totalPages = moviesRes.total_pages < 500 ? moviesRes.total_pages : 500;
      this.genres = genresRes.genres.reduce((acc, cur) => ({ ...acc, [cur.id]: cur.name }), {});
      this.isLoadingMovies = isLoadingMovies;
      this.currentPage = currentPage;
    });
  }

  getMovies(): void {
    this.movieService.fetchMovies();
  }
  getGenres(): void {
    this.movieService.fetchGenres();
  }

  setPreviousSearchQuery(searchQuery: string): void {
    // FIXME: into service
    this.prevSearchQuery = searchQuery;
  }
  setSearchQuery(searchQuery: string): void {
    // FIXME: into service
    this.searchQuery = searchQuery;
  }

  handleSearch(searchQuery: string): void {
    if (!searchQuery) return this.getMovies();
    this.movieService.setCurrentPage(1);
    this.movieService.searchMovies({ query: searchQuery });
    this.prevSearchQuery = searchQuery; // FIXME: into service
  }
  handleSearchKeyPress(event: KeyboardEvent) {
    event.preventDefault();
    if (this.prevSearchQuery === this.searchQuery) return;
    if (event.key === 'Enter') this.handleSearch(this.searchQuery);
  }
  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onPageChange(page: number): void {
    this.movieService.setCurrentPage(page);
    if (this.searchQuery) return this.movieService.searchMovies({ query: this.searchQuery, page });
    this.getMovies();
  }

  ngOnDestroy(): void {}
}
