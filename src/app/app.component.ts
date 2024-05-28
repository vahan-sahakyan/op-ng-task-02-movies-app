import { Component, OnDestroy, OnInit } from '@angular/core';
import { MovieService } from './services/movie.service';
import { Subject, combineLatest, takeUntil } from 'rxjs';
import { IGenre, IGenreMap, IMovie } from './models/movie/movie.model';

@Component({
  selector: 'app-root',
  styleUrls: ['./app.component.scss'],
  template: `
    <div class="min-h-screen py-20 px-10 dark:bg-zinc-800 dark:text-zinc-200">
      <router-outlet></router-outlet>
    </div>
  `,
})
export class AppComponent {}
