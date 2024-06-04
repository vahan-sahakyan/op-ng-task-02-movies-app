import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-spinner',
  styleUrls: ['./spinner.component.scss'],
  template: `
    <div
      [style.opacity]="isActive ? '0.4' : '0'"
      [ngClass]="{
        'pointer-events-none': !isActive,
        'grid h-screen w-screen fixed top-0 left-0 right-0 bottom-0': true,
        ' bg-white dark:bg-zinc-800 z-50 duration-100': true
      }"
    >
      <div [ngClass]="'place-self-center text-zinc-900 dark:text-white'">
        <i [ngClass]="'fa-duotone fa-2xl fa-spinner-third  animate-spin duration-1000'"></i>
      </div>
    </div>
  `,
})
export class SpinnerComponent {
  @Input() isActive: boolean = false;
}
