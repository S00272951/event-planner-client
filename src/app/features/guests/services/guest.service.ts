import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateGuestDto, Guest, UpdateGuestDto } from '../models/guest.model';

@Injectable({ providedIn: 'root' })
export class GuestService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/v1';

  // rsvp is optional, it adds ?rsvp=yes to the url
  getGuestsForEvent(eventId: string, rsvp = ''): Observable<Guest[]> {
    const params = rsvp ? { rsvp } : {};
    return this.http.get<Guest[]>(`${this.apiUrl}/events/${eventId}/guests`, { params });
  }

  getGuestById(id: string): Observable<Guest> {
    return this.http.get<Guest>(`${this.apiUrl}/guests/${id}`);
  }

  addGuest(eventId: string, guest: CreateGuestDto): Observable<Guest> {
    return this.http.post<Guest>(`${this.apiUrl}/events/${eventId}/guests`, guest);
  }

  updateGuest(id: string, changes: UpdateGuestDto): Observable<Guest> {
    return this.http.put<Guest>(`${this.apiUrl}/guests/${id}`, changes);
  }

  deleteGuest(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/guests/${id}`);
  }
}