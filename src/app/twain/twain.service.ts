// Mark Twain Quote service gets quotes from server
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { Observable, throwError, Observer } from 'rxjs';
import { concat, map, retryWhen, switchMap, take } from 'rxjs/operators';

import { Quote } from './quote';
import { QuoteServiceModel } from './quote.service.model';

@Injectable()
export class TwainService implements QuoteServiceModel {
  private nextId = 1;

  constructor(private http: HttpClient) {}

  getQuote(): Observable<string> {
    return new Observable((observer: Observer<number>) => observer.next(this.nextId++)).pipe(
      switchMap((id: number) => this.http.get<Quote>(`api/quotes/${id}`)),
      map((q: Quote) => q.quote),
      retryWhen((errors) =>
        errors.pipe(
          switchMap((error: HttpErrorResponse) => {
            if (error.status === 404) {
              // Queried for quote that doesn't exist.
            }
            // Some other HTTP error.
            console.error(error);
            return throwError('Cannot get Twain quotes from the server');
          }),
          take(2),
          // If a second retry value, then didn't find id:1 and triggers the following error
          concat(throwError('There are no Twain quotes')) // didn't find id:1
        )
      )
    );
  }
}

/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at https://angular.io/license
*/
