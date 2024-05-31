import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  styleUrls: ['./pagination.component.scss'],
  template: `
    <div class="relative flex justify-center mt-4 select-none">
      <button
        (click)="changePage(currentPage - 1)"
        [disabled]="currentPage === 1"
        [class.pointer-events-none]="currentPage === 1"
        class="{{
          'pagination-button hidden lg:block xl:block ' +
            ' rounded-full text-zinc-500 mx-1 hover:text-zinc-900 ' +
            'dark:text-zinc-400 dark:border-zinc-700 dark:hover:text-zinc-100  ' +
            ' justify-self-start absolute left-0 border-none disabled:cursor-not-allowed '
        }}"
      >
        Back
      </button>
      <app-pagination-button
        *ngFor="let page of visiblePages"
        [page]="page"
        [currentPage]="currentPage"
        [visiblePages]="visiblePages"
        (pageChange)="changePage($event)"
        [isSuperButton]="['SUPER_PREV', 'SUPER_NEXT'].includes(page.toString())"
      />
      <button
        (click)="changePage(currentPage + 1)"
        [disabled]="currentPage === totalPages"
        [class.pointer-events-none]="currentPage === totalPages"
        class="{{
          'pagination-button hidden lg:block xl:block ' +
            ' rounded-full text-zinc-500 mx-1 hover:text-zinc-900 ' +
            'dark:text-zinc-400 dark:border-zinc-700 dark:hover:text-zinc-100 ' +
            ' justify-self-end absolute right-0 border-none'
        }}"
      >
        Next
      </button>
    </div>
  `,
})
export class PaginationComponent {
  @Input() currentPage: number = 0;
  @Input() totalPages: number = 0;
  @Output() pageChange = new EventEmitter<number>();

  get visiblePages(): Array<string | number> {
    return getVisiblePages(this);
  }

  changePage(page: any): void {
    if (page === 'SUPER_PREV') {
      const newPage = Math.max(this.currentPage - 5, 1);
      this.pageChange.emit(newPage);
    } else if (page === 'SUPER_NEXT') {
      const newPage = Math.min(this.currentPage + 5, this.totalPages);
      this.pageChange.emit(newPage);
    } else if (page >= 1 && page <= this.totalPages) {
      this.pageChange.emit(page);
    }
  }
}

function getVisiblePages(self: PaginationComponent) {
  const totalVisiblePages = 5;
  const pages: Array<number | string> = [];

  if (self.totalPages <= totalVisiblePages) {
    addPageRange(1, self.totalPages, pages);
    return pages;
  }

  let startPage = Math.max(self.currentPage - 2, 1);
  let endPage = Math.min(startPage + totalVisiblePages - 1, self.totalPages);

  if (endPage - startPage < totalVisiblePages - 1) startPage = Math.max(endPage - totalVisiblePages + 1, 1);

  addPageRange(startPage, endPage, pages);

  if (startPage > 1) {
    pages.unshift(1);
    if (startPage > 2) pages.splice(1, 0, 'SUPER_PREV');
  }

  if (endPage < self.totalPages) {
    pages.push(self.totalPages);
    if (endPage < self.totalPages - 1) pages.splice(pages.length - 1, 0, 'SUPER_NEXT');
  }

  return pages;
}

function addPageRange(start: number, end: number, pages: Array<number | string> = []) {
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
}
