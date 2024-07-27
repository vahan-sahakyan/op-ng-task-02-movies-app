import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pagination-button',
  styleUrls: ['./pagination-button.component.scss', '../pagination/pagination.component.scss'],
  templateUrl: './pagination-button.component.html',
})
export class PaginationButtonComponent {
  @Input() visiblePages: Array<number | string> = [];
  @Input() page!: number | string;
  @Input() isSuperButton!: boolean;
  @Input() currentPage: number = 1;
  @Output() pageChange: EventEmitter<number | string> = new EventEmitter<number | string>();

  get isMobileViewPages(): boolean {
    return [+this.page - 2, +this.page - 1, this.page, +this.page + 1, +this.page + 2].includes(this.currentPage);
  }

  onChangePage(page: number | string) {
    this.pageChange.emit(page);
  }
}
