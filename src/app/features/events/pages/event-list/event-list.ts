import { Component, OnInit, inject, signal } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Observable, catchError, of } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { EventService } from '../../services/event.service';
import { PlannerEvent } from '../../models/event.model';
import { EventCard } from '../event-card/event-card';

@Component({
  selector: 'app-event-list',
  imports: [AsyncPipe, EventCard, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './event-list.html',
  styleUrl: './event-list.scss',
})
export class EventList implements OnInit {
  private eventService = inject(EventService);
  events$!: Observable<PlannerEvent[]>;
  errorMessage = signal('');

  ngOnInit(): void {
    this.loadEvents();
  }

  // location is optional, an empty one gets all events
  loadEvents(location = ''): void {
    this.errorMessage.set('');
    this.events$ = this.eventService.getEvents(location).pipe(
      catchError(error => {
        this.errorMessage.set(error.message);
        return of([]);
      })
    );
  }
}