import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { IDetailedMovie, NULL_DET_MOVIE } from 'src/app/models/movie/movie.model';
import { MovieService } from 'src/app/services/movie.service';

@Component({
  selector: 'app-movie-details',
  styleUrls: ['./movie-details.component.scss'],
  template: `
    <div class="grid">
      <div class="container mx-10 w-auto  xl:w-2/3  place-self-center p-4 relative">
        <button class="absolute top-8 -left-14 p-3  text-blue-500" (click)="goBack()">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
            class="w-6 h-6"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
        </button>

        <section
          class="flex gap-4 flex-col sm:flex-col md:flex-col lg:flex-row xl:flex-row  dark:bg-zinc-800 rounded-lg  justify-items-start"
        >
          <figure class="col-span-1 md:order-1  dark:bg-zinc-800   flex justify-center items-center">
            <img
              [src]="'https://image.tmdb.org/t/p/w500/' + detailedMovie.poster_path"
              alt="{{ detailedMovie.title }}"
              class="max-w-xs md:max-w-md rounded-lg shadow-lg shadow-zinc-500 dark:shadow-zinc-900"
            />
          </figure>

          <div class="col-span-1 md:order-2  dark:bg-zinc-800 p-6">
            <header>
              <h2 class="text-3xl font-bold mb-2 text-gray-800 dark:text-zinc-200">{{ detailedMovie.title }}</h2>
              <p class="text-gray-600 italic mb-4 dark:text-zinc-400">{{ detailedMovie.tagline }}</p>
              <p class="text-lg leading-relaxed mb-4 text-gray-800 dark:text-zinc-200">{{ detailedMovie.overview }}</p>
            </header>
            <hr class="border-gray-300 dark:border-zinc-600" />
            <br />

            <ul class="space-y-2">
              <li><span class="font-semibold">Release Date:</span> {{ detailedMovie.release_date | date }}</li>
              <li>
                <span class="font-semibold">Original Language:</span> {{ detailedMovie.original_language | uppercase }}
              </li>
              <li>
                <span class="font-semibold">Genres:</span>
                <ng-container *ngFor="let genre of detailedMovie.genres; let idx = index">
                  {{ idx !== detailedMovie.genres.length - 1 ? genre.name + ', ' : genre.name }}
                </ng-container>
              </li>
              <li><span class="font-semibold">Runtime:</span> {{ detailedMovie.runtime }} mins</li>
              <li><span class="font-semibold">Budget:</span> \${{ detailedMovie.budget | number }}</li>
              <li><span class="font-semibold">Revenue:</span> \${{ detailedMovie.revenue | number }}</li>
              <li><span class="font-semibold">Popularity:</span> {{ detailedMovie.popularity }}</li>
              <li><span class="font-semibold">Average Vote:</span> {{ detailedMovie.vote_average }}</li>
              <li><span class="font-semibold">Vote Count:</span> {{ detailedMovie.vote_count }}</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  `,
})
export class MovieDetailsComponent {
  movieId = '';
  detailedMovie: IDetailedMovie = NULL_DET_MOVIE;
  constructor(
    //
    private movieService: MovieService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.movieId = params['id'];
    });
    this.movieService.fetchMovieById(this.movieId);
    combineLatest([this.movieService.detailedMovie$]).subscribe(([detailedMovieRes]) => {
      this.detailedMovie = detailedMovieRes;
    });
  }
  goBack() {
    this.router.navigate(['/']);
  }
}
