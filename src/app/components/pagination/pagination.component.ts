import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MovieService } from '../../services/movie.service';

@Component({
  selector: 'app-pagination',
  styleUrls: ['./pagination.component.scss'],
  template: `
    <div [ngClass]="'relative flex justify-center mt-4 select-none'">
      <!-- use ngClass -->
      <button
        (click)="changePage(currentPage - 1)"
        [disabled]="currentPage === 1"
        [ngClass]="{
          'pointer-events-none': currentPage === 1,
          'pagination-button hidden lg:block xl:block ': true,
          ' rounded-full text-zinc-500 mx-1 hover:text-zinc-900 ': true,
          'dark:text-zinc-400 dark:border-zinc-700 dark:hover:text-zinc-100  ': true,
          ' justify-self-start absolute left-0 border-none disabled:cursor-not-allowed ': true,
        }"
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
        [ngClass]="{
          'pointer-events-none': currentPage === totalPages,
          'pagination-button hidden lg:block xl:block ': true,
          ' rounded-full text-zinc-500 mx-1 hover:text-zinc-900 ': true,
          'dark:text-zinc-400 dark:border-zinc-700 dark:hover:text-zinc-100 ': true,
          ' justify-self-end absolute right-0 border-none': true,
        }"
      >
        Next
      </button>
    </div>
  `,
})
export class PaginationComponent {
  @Input() currentPage: number = 0;
  @Input() totalPages: number = 0;

  constructor(public movieService: MovieService) {}

  get visiblePages(): Array<string | number> {
    return getVisiblePages(this);
  }

  changePage(page: any): void {
    const newPageMap: Record<string, number> = {
      SUPER_PREV: Math.max(this.currentPage - 5, 1),
      SUPER_NEXT: Math.min(this.currentPage + 5, this.totalPages),
    };
    this.movieService.handlePageChange(newPageMap[page] ?? page);
  }
}

function getVisiblePages(self: PaginationComponent) {
  const totalVisiblePages: number = 5;
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
