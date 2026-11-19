import { Component, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { EventService } from '../../services/event.service';
import { PlannerEvent } from '../../models/event.model';
import { EventCard } from '../event-card/event-card';
import { LoadState, withLoadState } from '../../../../shared/load-state';

@Component({
  selector: 'app-event-list',
  imports: [EventCard, MatButtonModule, MatFormFieldModule, MatInputModule],
  templateUrl: './event-list.html',
  styleUrl: './event-list.scss',
})
export class EventList {
  private eventService = inject(EventService);

  readonly location = signal('');
  readonly initial: LoadState<PlannerEvent[]> = { status: 'loading' };

  // every time location changes, switchMap gets the events again
  state = toSignal(
    toObservable(this.location).pipe(
      switchMap((location) => withLoadState(this.eventService.getEvents(location))),
    ),
    { initialValue: this.initial },
  );

  search(location: string): void {
    this.location.set(location.trim());
  }
}