import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Guest } from '../models/guest.model';

@Injectable({ providedIn: 'root' })
export class GuestService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/v1';

  // rsvp is optional, it adds ?rsvp=... to the url
  getGuestsForEvent(eventId: string, rsvp?: string): Observable<Guest[]> {
    let params = new HttpParams();
    if (rsvp) {
      params = params.set('rsvp', rsvp);
    }
    return this.http.get<Guest[]>(`${this.apiUrl}/events/${eventId}/guests`, { params }).pipe(
      catchError(this.handleError)
    );
  }

  getGuestById(id: string): Observable<Guest> {
    return this.http.get<Guest>(`${this.apiUrl}/guests/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  addGuest(eventId: string, guest: Guest): Observable<Guest> {
    return this.http.post<Guest>(`${this.apiUrl}/events/${eventId}/guests`, guest).pipe(
      catchError(this.handleError)
    );
  }

  updateGuest(id: string, guest: Guest): Observable<Guest> {
    return this.http.put<Guest>(`${this.apiUrl}/guests/${id}`, guest).pipe(
      catchError(this.handleError)
    );
  }

  deleteGuest(id: string): Observable<unknown> {
    return this.http.delete(`${this.apiUrl}/guests/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      console.error('An error occurred:', error.error);
    } else {
      console.error(`Backend returned code ${error.status}, body was: `, error.error);
    }
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }
}