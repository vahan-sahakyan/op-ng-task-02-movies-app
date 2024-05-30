import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MovieService } from './services/movie.service';
import { Subject, combineLatest, takeUntil } from 'rxjs';

@Component({
  selector: 'app-root',
  styleUrls: ['./app.component.scss'],
  template: `
    <div class="min-h-screen py-20 px-10 dark:bg-zinc-800 dark:text-zinc-200">
      <router-outlet></router-outlet>
      <app-spinner [isActive]="isLoadingMoviesService" />
    </div>
  `,
})
export class AppComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  isLoadingMoviesService = false;
  constructor(private movieService: MovieService) {}
  ngOnInit(): void {
    combineLatest([
      this.movieService.isLoadingMovies$,
      this.movieService.isLoadingGenres$,
      this.movieService.isLoadingDetailedMovie$,
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([isLoadingMovies, isLoadingGenres, isLoadingDetailedMovie]) => {
        this.isLoadingMoviesService = isLoadingMovies || isLoadingGenres || isLoadingDetailedMovie;
      });
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
