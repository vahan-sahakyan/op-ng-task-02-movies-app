import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pagination-button',
  styleUrls: ['./pagination-button.component.scss', '../pagination/pagination.component.scss'],
  template: `
    <button
      (click)="onChangePage(page)"
      [class.active]="page === currentPage"
      [class.font-bold]="page === currentPage"
      class="{{
        'pagination-button rounded-full text-zinc-900 mx-1  hover:text-zinc-500 sm:-scale-50' +
          'dark:text-zinc-400 dark:border-zinc-700 dark:hover:text-zinc-100  ' +
          (![+page - 2, +page - 1, page, +page + 1, +page + 2].includes(currentPage)
            ? 'hidden sm:hidden md:block lg:block xl:block'
            : '')
      }}"
    >
      {{ isSuperButton ? '. . . ' : page }}
    </button>
  `,
})
export class PaginationButtonComponent {
  @Input() visiblePages: Array<number | string> = [];
  @Input() page!: number | string;
  @Input() isSuperButton!: boolean;
  @Input() currentPage: number = 1;
  @Output() pageChange = new EventEmitter<number | string>();

  onChangePage(page: number | string) {
    this.pageChange.emit(page);
  }
}
