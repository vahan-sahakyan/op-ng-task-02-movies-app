import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-no-results',
  styleUrls: ['./no-results.component.scss'],
  template: `
    <div class="py-40 text-center">
      <h3 class="no-results__header font-bold">No Results</h3>
      <p class="no-results__text typ-subhead">
        There were no results for “{{ text }}” on <br />Movies Application. Try a new search.
      </p>
    </div>
  `,
})
export class NoResultsComponent {
  @Input() text: string = '';
}
