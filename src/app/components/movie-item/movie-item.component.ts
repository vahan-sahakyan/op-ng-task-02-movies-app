import { Component, Input } from '@angular/core';
import { IGenreMap, IMovie } from 'src/app/models/movie/movie.model';

@Component({
  selector: 'app-movie-item',
  styleUrls: ['./movie-item.component.scss'],
  templateUrl: './movie-item.component.html',
})
export class MovieItemComponent {
  @Input() movie: IMovie = {} as IMovie;
  @Input() genres: IGenreMap = {} as IGenreMap;
}
