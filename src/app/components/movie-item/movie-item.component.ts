import { Component, Input } from '@angular/core';
import { IGenreMap, IMovie } from 'src/app/models/movie/movie.model';

@Component({
  selector: 'app-movie-item',
  styleUrls: ['./movie-item.component.scss'],
  template: `
    <figure class="movie-item bg-white rounded-xl dark:bg-zinc-800">
      <a [routerLink]="['/', movie.id]">
        <header class="movie-item__poster relative mb-4">
          <div
            class="movie-item__poster--sceleton w-full rounded-xl absolute bg-zinc-500 animate-pulse duration-75 opacity-25"
          ></div>
          <img
            [src]="'https://image.tmdb.org/t/p/w500' + movie.poster_path"
            class="movie-item__poster--image w-full rounded-xl absolute shadow-zinc-400 dark:shadow-zinc-900 shadow-lg "
          />
          <div class="movie-item__poster--space rounded-xl opacity-0"></div>
        </header>
      </a>

      <footer class="h-0">
        <p class="text-sm mb-0 dark:text-zinc-400 text-zinc-500">
          {{ genres[(movie.genre_ids || [])[0]] | uppercase }}
        </p>
        <h3 class="text-lg font-semibold mb-0  dark:text-zinc-200">
          <a [routerLink]="['/', movie.id]" class="text-zinc-700 hover:underline dark:text-zinc-200 ">
            {{ movie.title }}
          </a>
        </h3>

        <div class="mb-4 dark:text-zinc-400 text-zinc-500 flex flex-row ">
          {{ movie.release_date | date : 'yyyy' }}
          · Rating: {{ movie.vote_average | number : '1.0-2' }}
        </div>
      </footer>
    </figure>
  `,
})
export class MovieItemComponent {
  @Input() movie = {} as IMovie;
  @Input() genres = {} as IGenreMap;
}
