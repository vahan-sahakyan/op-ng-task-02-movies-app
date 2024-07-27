import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, combineLatest, takeUntil } from 'rxjs';
import { IDetailedMovie } from 'src/app/models/movie/movie.model';
import { MovieService } from 'src/app/services/movie.service';

@Component({
  selector: 'app-movie-details',
  styleUrls: ['./movie-details.component.scss'],
  templateUrl: './movie-details.component.html',
})
export class MovieDetailsComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  movieId: string = '';
  detailedMovie: IDetailedMovie | undefined;
  constructor(
    //
    private movieService: MovieService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(({ id }) => (this.movieId = id));
    this.movieService.fetchMovieById(this.movieId);
    combineLatest([this.movieService.detailedMovie$])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([detailedMovieRes]) => {
        this.detailedMovie = detailedMovieRes;
      });
  }
  goBack() {
    this.router.navigate(['/']);
  }
  ngOnDestroy(): void {
    this.movieService.detailedMovieSubject.next(undefined);
    this.destroy$.next();
    this.destroy$.complete();
  }
}
