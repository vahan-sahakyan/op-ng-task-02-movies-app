import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-pagination-button',
  styleUrls: ['./pagination-button.component.scss', '../pagination/pagination.component.scss'],
  template: `
    <button
      (click)="onChangePage(page)"
      [class.active]="page === currentPage"
      [class.font-bold]="page === currentPage"
      [style.border]="isPrevOrNextPage ? 'none' : ''"
      class="{{
        'pagination-button px-3 py-1 mx-1 bg-white text-blue-600 border-zinc-30 hover:text-blue-600 hover:border-blue-500' +
          ' dark:bg-zinc-900  dark:text-zinc-400 ' +
          ' dark:border-zinc-700 dark:hover:border-blue-500 dark:hover:text-blue-500 hover:font-bold '
      }}"
    >
      {{ isPrevOrNextPage ? '. . . ' : page }}
    </button>
  `,
})
export class PaginationButtonComponent {
  @Input() visiblePages: Array<number | string> = [];
  @Input() page!: number | string;
  @Input() isPrevOrNextPage!: boolean;
  @Input() currentPage: number = 1;
  @Output() pageChange = new EventEmitter<number | string>();

  onChangePage(page: number | string) {
    this.pageChange.emit(page);
  }
}
