import { Component, inject, input, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { switchMap } from 'rxjs';
import { PlannerEvent } from '../../models/event.model';
import { EventService } from '../../services/event.service';
import { LoadState, withLoadState } from '../../../../shared/load-state';

@Component({
  selector: 'app-event-details',
  imports: [DatePipe, RouterLink, MatButtonModule],
  templateUrl: './event-details.html',
  styleUrl: './event-details.scss',
})
export class EventDetails {
  private eventService = inject(EventService);
  private readonly router = inject(Router);

  readonly id = input.required<string>();
  readonly initial: LoadState<PlannerEvent> = { status: 'loading' };

  readonly deleting = signal(false);
  readonly deleteError = signal<string | null>(null);

  state = toSignal(
    toObservable(this.id).pipe(
      switchMap((id) => withLoadState(this.eventService.getEventById(id))),
    ),
    { initialValue: this.initial },
  );

  deleteEvent(event: PlannerEvent): void {
    if (!confirm(`Delete ${event.title} and all of its guests?`)) return;

    this.deleting.set(true);
    this.deleteError.set(null);

    this.eventService.deleteEvent(event._id).subscribe({
      next: () => this.router.navigate(['/events']),
      error: (err: Error) => {
        this.deleteError.set(err.message);
        this.deleting.set(false);
      },
    });
  }
}