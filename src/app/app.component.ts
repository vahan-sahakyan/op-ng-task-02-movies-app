import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MovieService } from './services/movie.service';
import { combineLatest } from 'rxjs';

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
export class AppComponent implements OnInit {
  isLoadingMoviesService = false;
  constructor(private movieService: MovieService) {}
  ngOnInit(): void {
    combineLatest([
      this.movieService.isLoadingMovies$,
      this.movieService.isLoadingGenres$,
      this.movieService.isLoadingDetailedMovie$,
    ]).subscribe(([isLoadingMovies, isLoadingGenres, isLoadingDetailedMovie]) => {
      this.isLoadingMoviesService = isLoadingMovies || isLoadingGenres || isLoadingDetailedMovie;
    });
  }
}
