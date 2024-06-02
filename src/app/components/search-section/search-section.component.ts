import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Subject, combineLatest, takeUntil } from 'rxjs';
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
    <header class="mb-4 flex flex-row gap-4 items-center justify-center relative">
      <i class="fa fa-search absolute top-3 left-4 pointer-events-none text-zinc-500"></i>
      <!-- use ngClass -->
      <input
        #searchInputRef
        [value]="searchQuery"
        (input)="onInputChange($event)"
        (keyup)="onSearchKeyPress($event)"
        placeholder="Search Movies"
        class="{{
          'w-full p-2 ps-12 rounded-xl border-none outline focus:outline outline-2 duration-75 focus:shadow-2xl dark:focus:shadow-none focus:shadow-zinc-400  ' +
            ' bg-zinc-100 font-bold placeholder-zinc-400 text-zinc-500 outline-zinc-200 focus:outline-blue-400 ' +
            ' dark:bg-zinc-700 dark:placeholder-zinc-400 dark:text-zinc-200 dark:outline-zinc-600 dark:focus:outline-blue-500  '
        }}"
      />
      <div
        class=" absolute top-3 right-16 flex items-center h-1 cursor-pointer text-zinc-500 dark:text-zinc-300 "
        *ngIf="this.searchQuery"
      >
        <i class="far fa-circle-xmark h-1" (click)="onResetSearch()"></i>
      </div>
      <!-- use ngClass -->
      <div
        class="{{
          ' absolute top-4.5 right-3 flex items-center pointer-events-none border-2 py-3 px-2 rounded-md ' +
            ' text-zinc-400  border-zinc-300  dark:text-zinc-500  dark:border-zinc-600 '
        }}"
      >
        <i class="fa-sharp fa-solid fa-xs fa-slash-forward"></i>
      </div>
    </header>
  `,
})
export class SearchSectionComponent implements OnInit, OnDestroy, AfterViewInit {
  private destroy$ = new Subject<void>();
  searchQuery = '';
  prevSearchQuery = '';

  @Output() search = new EventEmitter<string>();
  @Output() resetSearch = new EventEmitter<void>();
  @Output() searchKeyPress = new EventEmitter<KeyboardEvent>();
  @Input() setPreviousSearchQuery?: CallableFunction; // why you are sending a CB function as an Input ?
  @ViewChild('searchInputRef') searchInputRef!: ElementRef;

  constructor(private moviesService: MovieService) {}

  ngAfterViewInit(): void {
    // see HostListener => https://angular.io/api/core/HostListener
    window.addEventListener('keydown', this.handleFocusInput);
  }

  handleFocusInput = (event: KeyboardEvent) => {
    if (event.key === '/') {
      event.preventDefault();
      this.searchInputRef.nativeElement.focus();
    }
  };

  // this can be removed once you get rid of the getters and the setters. and using the search service file
  ngOnInit(): void {
    combineLatest([this.moviesService.searchQuery$])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([searchQuery]) => {
        this.searchQuery = searchQuery;
      });
  }

  // I can't see that this method is used anywhere in the application.
  onSearch() {
    console.log('gagagagajhklsfv');

    if (this.searchQuery === this.prevSearchQuery) return;
    this.search.emit();
    this.prevSearchQuery = this.searchQuery;
    this.setPreviousSearchQuery?.(this.searchQuery); // ??
  }

  onSearchKeyPress(event: KeyboardEvent) {
    if (event.key === 'Escape') this.searchInputRef.nativeElement.blur();
    this.searchKeyPress.emit(event);
  }

  onInputChange($event: Event) {
    this.searchQuery = ($event.target as HTMLInputElement).value;
    this.moviesService.setSearchQuery(($event.target as HTMLInputElement).value);
  }

  onResetSearch() {
    if (!this.searchQuery) return;
    this.resetSearch.emit();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    window.removeEventListener('keydown', this.handleFocusInput);
  }
}
