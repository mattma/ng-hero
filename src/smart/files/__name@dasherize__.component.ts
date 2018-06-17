import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from '@hero/common';

// import { get<%= classify(name) %> } from './shared/store/';
// import { <%= classify(name) %> } from './shared/<%= dasherize(name) %>.model';

@Component({
  selector: '<%= selector %>',<% if(inlineTemplate) { %>
  template: `
    <h2>
      <%= dasherize(name) %> works!
    </h2>
  `,<% } else { %>
  templateUrl: './<%= dasherize(name) %>.component.html',<% } %>
  styleUrls: ['./<%= dasherize(name) %>.component.scss'],
})
export class <%= classify(name) %>Component {
  // public <%= name %>$: Observable<<%= classify(name) %>>;

  constructor(private store: Store<AppState>) {
    // this.<%= name %>$ = store.select(get<%= classify(name) %>);
  }
}
