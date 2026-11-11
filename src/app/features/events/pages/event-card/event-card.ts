import { Component, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { PlannerEvent } from '../../models/event.model';

@Component({
  selector: 'app-event-card',
  imports: [DatePipe, RouterLink, MatCardModule, MatButtonModule],
  templateUrl: './event-card.html',
  styleUrl: './event-card.scss',
})
export class EventCard {
  event = input.required<PlannerEvent>();
}