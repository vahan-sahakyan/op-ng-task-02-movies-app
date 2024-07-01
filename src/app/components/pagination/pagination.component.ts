import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MovieService } from '../../services/movie.service';

@Component({
  selector: 'app-pagination',
  styleUrls: ['./pagination.component.scss'],
  templateUrl: './pagination.component.html',
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
