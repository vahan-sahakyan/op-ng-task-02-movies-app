import { Component, ElementRef, EventEmitter, HostListener, Output, ViewChild } from '@angular/core';
import { MovieService } from 'src/app/services/movie.service';

// I see that you are relaying on Outputs a lot in a way that makes the code a little bit hard to track.
/**
 * the service will contain the searchQuery string and any validation require.
 * the service will have the necessary methods to fetch the search result.
 */

@Component({
  selector: 'app-search-section',
  styleUrls: ['./search-section.component.scss'],
  templateUrl: './search-section.component.html',
})
export class SearchSectionComponent {
  prevSearchQuery: string = '';

  @Output() searchKeyPress: EventEmitter<KeyboardEvent> = new EventEmitter<KeyboardEvent>();
  @ViewChild('searchInputRef') searchInputRef!: ElementRef;

  constructor(public movieService: MovieService) {}

  @HostListener('window:keydown', ['$event'])
  handleFocusInput(event: KeyboardEvent) {
    if (event.key === '/') {
      event.preventDefault();
      this.searchInputRef.nativeElement.focus();
    }
  }

  onSearchKeyPress(event: KeyboardEvent) {
    if (event.key === 'Escape') this.searchInputRef.nativeElement.blur();
    this.searchKeyPress.emit(event);
  }

  onInputChange($event: Event) {
    this.movieService.searchQuerySubject.next(($event.target as HTMLInputElement).value);
  }

  onResetSearch() {
    if (!this.movieService.searchQuerySubject.value) return;
    this.movieService.handleSearchReset();
  }
}
