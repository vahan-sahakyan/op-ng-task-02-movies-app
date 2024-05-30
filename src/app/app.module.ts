import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MovieDetailsComponent } from './components/movie-details/movie-details.component';
import { MovieItemComponent } from './components/movie-item/movie-item.component';
import { MovieListComponent } from './components/movie-list/movie-list.component';
import { NoResultsComponent } from './components/no-results/no-results.component';
import { PaginationButtonComponent } from './components/pagination-button/pagination-button.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { ScrollUpComponent } from './components/scroll-up/scroll-up.component';
import { SearchSectionComponent } from './components/search-section/search-section.component';
import { SpinnerComponent } from './components/spinner/spinner.component';

@NgModule({
  declarations: [
    AppComponent,
    PaginationComponent,
    PaginationButtonComponent,
    MovieItemComponent,
    MovieDetailsComponent,
    MovieListComponent,
    NoResultsComponent,
    ScrollUpComponent,
    SpinnerComponent,
    SearchSectionComponent,
  ],
  imports: [FormsModule, BrowserModule, AppRoutingModule, HttpClientModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
