import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-spinner',
  template: `
    <div
      [style.opacity]="isActive ? '0.4' : '0'"
      class="grid h-screen w-screen fixed top-0 left-0 right-0 bottom-0 bg-white dark:bg-zinc-800 z-50 duration-100"
      [ngClass]="{
    'pointer-events-none': !isActive,
  }"
    >
      <div class=" place-self-center text-zinc-900 dark:text-white ">
        <i class="fa-duotone fa-2xl fa-spinner-third  animate-spin duration-1000"></i>
      </div>
    </div>
  `,
  styleUrls: ['./spinner.component.scss'],
})
export class SpinnerComponent {
  @Input() isActive = false;
}
