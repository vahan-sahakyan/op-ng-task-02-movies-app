import { Component} from '@angular/core';
import { MovieService } from './services/movie.service';

// create html file for each component.

@Component({
  selector: 'app-root',
  styleUrls: ['./app.component.scss'],
  template: `
    <div class="min-h-screen py-20 px-10 dark:bg-zinc-800 dark:text-zinc-200">
      <router-outlet></router-outlet>
      <app-spinner [isActive]="movieService.isLoadingMoviesService" />
    </div>
  `,
})
// I don't think you need any logic for getting data here. this is only the entry point for the Application
// the real one is the movie-list component which will load on the main route.
export class AppComponent {
  constructor(
    public movieService: MovieService,
  ) {}
}
