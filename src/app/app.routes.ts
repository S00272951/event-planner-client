import { Routes } from '@angular/router';
import { EventList } from './features/events/pages/event-list/event-list';
import { EventDetails } from './features/events/pages/event-details/event-details';
import { EventForm } from './features/events/pages/event-form/event-form';
import { GuestForm } from './features/guests/pages/guest-form/guest-form';

export const routes: Routes = [
  { path: '', redirectTo: 'events', pathMatch: 'full' },
  { path: 'events', component: EventList },
  { path: 'events/new', component: EventForm },
  { path: 'events/:id', component: EventDetails },
  { path: 'events/:id/edit', component: EventForm },
  { path: 'events/:eventId/guests/new', component: GuestForm },
  { path: 'events/:eventId/guests/:guestId/edit', component: GuestForm },
  { path: '**', redirectTo: 'events' },
];