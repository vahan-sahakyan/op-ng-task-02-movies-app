import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-spinner',
  styleUrls: ['./spinner.component.scss'],
  templateUrl: './spinner.component.html',
})
export class SpinnerComponent {
  @Input() isActive: boolean = false;
}
