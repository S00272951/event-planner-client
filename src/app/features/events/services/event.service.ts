import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { PlannerEvent } from '../models/event.model';

@Injectable({ providedIn: 'root' })
export class EventService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/v1/events';

  // location is optional, it adds ?location=... to the url
  getEvents(location?: string): Observable<PlannerEvent[]> {
    let params = new HttpParams();
    if (location) {
      params = params.set('location', location);
    }
    return this.http.get<PlannerEvent[]>(this.apiUrl, { params }).pipe(
      catchError(this.handleError)
    );
  }

  getEventById(id: string): Observable<PlannerEvent> {
    return this.http.get<PlannerEvent>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  addEvent(event: PlannerEvent): Observable<PlannerEvent> {
    return this.http.post<PlannerEvent>(this.apiUrl, event).pipe(
      catchError(this.handleError)
    );
  }

  updateEvent(id: string, event: PlannerEvent): Observable<PlannerEvent> {
    return this.http.put<PlannerEvent>(`${this.apiUrl}/${id}`, event).pipe(
      catchError(this.handleError)
    );
  }

  deleteEvent(id: string): Observable<unknown> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
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