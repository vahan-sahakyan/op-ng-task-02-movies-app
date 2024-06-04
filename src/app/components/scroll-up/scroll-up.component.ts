import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-scroll-up',
  styleUrls: ['./scroll-up.component.scss'],
  template: `
    <!-- use ngClass -->
    <button
      (click)="handleScrollToTop()"
      [ngClass]="
        'scroll-to-top z-50 fixed bottom-8 right-8 p-3 rounded-full border aspect-square  h-14 w-14 ' +
        ' hover:text-blue-500 border-zinc-300 hover:border-blue-500 ' +
        ' bg-white dark:bg-zinc-800 text-blue-500 dark:text-zinc-400 dark:border-zinc-700 '
      "
    >
      <i [ngClass]="'fal fa-lg fa-arrow-up'"></i>
    </button>
  `,
})
export class ScrollUpComponent {
  @Output() scrollUp: EventEmitter<void> = new EventEmitter<void>();

  handleScrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
