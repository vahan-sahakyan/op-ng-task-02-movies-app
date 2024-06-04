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
  template: `
    <header [ngClass]="'mb-4 flex flex-row gap-4 items-center justify-center relative'">
      <i [ngClass]="'fa fa-search absolute top-3 left-4 pointer-events-none text-zinc-500'"></i>
      <!-- use ngClass -->
      <input
        #searchInputRef
        [value]="movieService.searchQuerySubject.value"
        (input)="onInputChange($event)"
        (keyup)="onSearchKeyPress($event)"
        placeholder="Search Movies"
        [ngClass]="
          'w-full p-2 ps-12 rounded-xl border-none outline focus:outline outline-2 duration-75 focus:shadow-2xl dark:focus:shadow-none focus:shadow-zinc-400  ' +
          ' bg-zinc-100 font-bold placeholder-zinc-400 text-zinc-500 outline-zinc-200 focus:outline-blue-400 ' +
          ' dark:bg-zinc-700 dark:placeholder-zinc-400 dark:text-zinc-200 dark:outline-zinc-600 dark:focus:outline-blue-500  '
        "
      />
      <div [ngClass]="'absolute top-3 right-16 flex items-center h-1 cursor-pointer text-zinc-500 dark:text-zinc-300 '">
        <i
          *ngIf="movieService.searchQuerySubject.value"
          [ngClass]="'far fa-circle-xmark h-1'"
          (click)="onResetSearch()"
        ></i>
      </div>
      <!-- use ngClass -->
      <div
        [ngClass]="
          ' absolute top-4.5 right-3 flex items-center pointer-events-none border-2 py-3 px-2 rounded-md ' +
          ' text-zinc-400  border-zinc-300  dark:text-zinc-500  dark:border-zinc-600 '
        "
      >
        <i [ngClass]="'fa-sharp fa-solid fa-xs fa-slash-forward'"></i>
      </div>
    </header>
  `,
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
