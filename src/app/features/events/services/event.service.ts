import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateEventDto, PlannerEvent, UpdateEventDto } from '../models/event.model';

@Injectable({ providedIn: 'root' })
export class EventService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/v1/events';

  // location is optional, it adds ?location=Sligo to the url
  getEvents(location = ''): Observable<PlannerEvent[]> {
    const params = location ? { location } : {};
    return this.http.get<PlannerEvent[]>(this.apiUrl, { params });
  }

  getEventById(id: string): Observable<PlannerEvent> {
    return this.http.get<PlannerEvent>(`${this.apiUrl}/${id}`);
  }

  addEvent(event: CreateEventDto): Observable<PlannerEvent> {
    return this.http.post<PlannerEvent>(this.apiUrl, event);
  }

  updateEvent(id: string, changes: UpdateEventDto): Observable<PlannerEvent> {
    return this.http.put<PlannerEvent>(`${this.apiUrl}/${id}`, changes);
  }

  deleteEvent(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}