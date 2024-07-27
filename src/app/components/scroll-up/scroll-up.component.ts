import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-scroll-up',
  styleUrls: ['./scroll-up.component.scss'],
  templateUrl: './scroll-up.component.html',
})
export class ScrollUpComponent {
  @Output() scrollUp: EventEmitter<void> = new EventEmitter<void>();

  handleScrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
