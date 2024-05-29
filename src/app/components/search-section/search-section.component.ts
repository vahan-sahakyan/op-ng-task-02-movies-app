import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-search-section',
  template: `
    <header class="mb-4 flex flex-row gap-4 items-center justify-center relative">
      <i class="fa fa-search absolute top-3 left-4 pointer-events-none text-zinc-500"></i>
      <input
        (keyup)="onSearchKeyPress($event)"
        (change)="onInputChange($event)"
        placeholder=""
        class="{{
          'w-full p-2 ps-12 rounded-xl border-none focus:outline focus:outline-2 ' +
            ' bg-zinc-100 font-bold placeholder-zinc-400 text-zinc-500  focus:outline-zinc-200 ' +
            ' dark:placeholder-zinc-400 dark:text-zinc-200  dark:focus:outline-zinc-500 dark:bg-zinc-700'
        }}"
      />
      <div class=" absolute top-3 right-36 flex items-center h-1 pointer-events-none text-zinc-500 ">
        <i class="fa fa-command h-1"></i>
        <strong class="pl-2 pb-2.5 h-1">K</strong>
      </div>
      <button
        type="submit"
        (click)="onSearch()"
        class="{{
          'p-2 px-6 rounded-xl font-bold' +
            '  text-zinc-500 bg-zinc-100  hover:bg-zinc-100 ' +
            ' dark:hover:text-zinc-100 dark:text-zinc-400  dark:bg-zinc-700 dark:hover:bg-zinc-700'
        }}"
      >
        Search
      </button>
    </header>
  `,
  styleUrls: ['./search-section.component.scss'],
})
export class SearchSectionComponent {
  searchQuery = '';
  prevSearchQuery = '';

  @Output() search = new EventEmitter<string>();
  @Output() searchKeyPress = new EventEmitter<KeyboardEvent>();
  @Input() setPreviousSearchQuery?: CallableFunction;
  @Input() setSearchQuery?: CallableFunction;

  onSearch() {
    if (this.searchQuery === this.prevSearchQuery) return;
    this.search.emit(this.searchQuery);

    this.prevSearchQuery = this.searchQuery; // FIXME: into service
    this.setPreviousSearchQuery?.(this.searchQuery); // FIXME: into service
  }

  onSearchKeyPress(event: KeyboardEvent) {
    this.searchKeyPress.emit(event);
  }

  onInputChange($event: Event) {
    this.searchQuery = ($event.target as HTMLInputElement).value;
    this.setSearchQuery?.(this.searchQuery);
  }
}
