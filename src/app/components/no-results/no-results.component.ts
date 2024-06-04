import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-no-results',
  styleUrls: ['./no-results.component.scss'],
  templateUrl: './no-results.component.html',
})
export class NoResultsComponent {
  @Input() text: string = '';
}
