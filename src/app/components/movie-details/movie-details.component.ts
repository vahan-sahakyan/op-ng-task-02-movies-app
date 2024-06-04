import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, combineLatest, takeUntil } from 'rxjs';
import { IDetailedMovie } from 'src/app/models/movie/movie.model';
import { MovieService } from 'src/app/services/movie.service';

@Component({
  selector: 'app-movie-details',
  styleUrls: ['./movie-details.component.scss'],
  template: `
    <div [ngClass]="'grid'">
      <div *ngIf="detailedMovie" [ngClass]="'container mx-10 w-auto  xl:w-2/3  place-self-center p-4 relative'">
        <button [ngClass]="'absolute top-12 -left-14 p-3 text-zinc-500 hover:text-zinc-600'" (click)="goBack()">
          <i [ngClass]="'fas fa-2xl fa-angle-left'"></i>
        </button>
        <section
          [ngClass]="
            'flex gap-4 flex-col sm:flex-col md:flex-col lg:flex-row xl:flex-row  dark:bg-zinc-800 rounded-lg  justify-items-start'
          "
        >
          <figure [ngClass]="'col-span-1 md:order-1  dark:bg-zinc-800   flex justify-center items-center'">
            <img
              [src]="'https://image.tmdb.org/t/p/w500' + detailedMovie.poster_path"
              alt="{{ detailedMovie.title }}"
              [ngClass]="'max-w-xs md:max-w-md rounded-lg shadow-lg shadow-zinc-500 dark:shadow-zinc-900'"
            />
          </figure>

          <div [ngClass]="'col-span-1 md:order-2  dark:bg-zinc-800 p-6'">
            <header>
              <h2 [ngClass]="'text-3xl font-bold mb-2 text-gray-800 dark:text-zinc-200'">{{ detailedMovie.title }}</h2>
              <p [ngClass]="'text-gray-600 italic mb-4 dark:text-zinc-400'">{{ detailedMovie.tagline }}</p>
              <p [ngClass]="'text-lg leading-relaxed mb-4 text-gray-800 dark:text-zinc-200'">
                {{ detailedMovie.overview }}
              </p>
            </header>
            <hr [ngClass]="'border-gray-300 dark:border-zinc-600 mb-8'" />

            <ul [ngClass]="'space-y-2'">
              <li><span [ngClass]="'font-semibold'">Release Date:</span> {{ detailedMovie.release_date | date }}</li>
              <li>
                <span [ngClass]="'font-semibold'">Original Language:</span>
                {{ detailedMovie.original_language | uppercase }}
              </li>
              <li>
                <span [ngClass]="'font-semibold'">Genres:</span>
                <ng-container *ngFor="let genre of detailedMovie.genres; let idx = index">
                  {{ idx !== detailedMovie.genres.length - 1 ? genre.name + ', ' : genre.name }}
                </ng-container>
              </li>
              <li><span [ngClass]="'font-semibold'">Runtime:</span> {{ detailedMovie.runtime }} mins</li>
              <li><span [ngClass]="'font-semibold'">Budget:</span> \${{ detailedMovie.budget | number }}</li>
              <li><span [ngClass]="'font-semibold'">Revenue:</span> \${{ detailedMovie.revenue | number }}</li>
              <li><span [ngClass]="'font-semibold'">Popularity:</span> {{ detailedMovie.popularity }}</li>
              <li><span [ngClass]="'font-semibold'">Average Vote:</span> {{ detailedMovie.vote_average }}</li>
              <li><span [ngClass]="'font-semibold'">Vote Count:</span> {{ detailedMovie.vote_count }}</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  `,
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
