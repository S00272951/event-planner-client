import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { EventService } from '../../services/event.service';
import { EventCard } from '../event-card/event-card';
import { withLoadState } from '../../../../shared/load-state';

@Component({
  selector: 'app-event-list',
  imports: [EventCard],
  templateUrl: './event-list.html',
  styleUrl: './event-list.scss',
})
export class EventList {
  private eventService = inject(EventService);

  state = toSignal(withLoadState(this.eventService.getEvents()), { requireSync: true });
}