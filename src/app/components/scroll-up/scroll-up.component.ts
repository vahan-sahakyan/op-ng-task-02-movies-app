import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-scroll-up',
  styleUrls: ['./scroll-up.component.scss'],
  template: `
    <button
      class="scroll-to-top z-50 fixed bottom-8 right-8 p-3 text-blue-500 dark:text-zinc-400 hover:text-blue-500 rounded-full border border-zinc-300 dark:border-zinc-700 hover:border-blue-500 bg-white dark:bg-zinc-800"
      (click)="scrollToTop()"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="feather feather-arrow-up"
      >
        <line x1="12" y1="19" x2="12" y2="5"></line>
        <polyline points="5 12 12 5 19 12"></polyline>
      </svg>
    </button>
  `,
})
export class ScrollUpComponent {
  @Output() scrollUp = new EventEmitter<void>();

  scrollToTop(): void {
    this.scrollUp.emit();
  }
}
