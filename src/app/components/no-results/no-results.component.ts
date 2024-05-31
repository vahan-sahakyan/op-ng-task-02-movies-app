import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-no-results',
  styleUrls: ['./no-results.component.scss'],
  template: `
    <div class="py-40 text-center">
      <h3 class="font-bold">No Results</h3>
      <p>There were no results for “{{ text }}” on <br />Movies Application. Try a new search.</p>
    </div>
  `,
})
export class NoResultsComponent {
  @Input() text: string = '';
}
