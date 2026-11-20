import { Component, OnInit, inject, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CreateEventDto } from '../../models/event.model';
import { EventService } from '../../services/event.service';
import { notBlank } from '../../../../shared/validators/not-blank.validator';

@Component({
  selector: 'app-event-form',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressBarModule
  ],
  templateUrl: './event-form.html',
  styleUrl: './event-form.scss',
})
export class EventForm implements OnInit {
  private formBuilder = inject(FormBuilder);
  private eventService = inject(EventService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  readonly id = input<string>();  // note this is optional by default

  saving = signal(false);
  saveError = signal<string | null>(null);

  eventForm = this.formBuilder.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100), notBlank]],
    date: ['', Validators.required],
    location: ['', [Validators.required, Validators.maxLength(100), notBlank]],
    description: ['', Validators.maxLength(500)],
  });

  ngOnInit(): void {
    const id = this.id();
    if (!id) return; // adding a new event, nothing to load

    this.eventService.getEventById(id).subscribe({
      next: (event) =>
        this.eventForm.patchValue({
          title: event.title,
          date: event.date.slice(0, 10), // the date input wants YYYY-MM-DD
          location: event.location,
          description: event.description ?? '',
        }),
      error: (err: Error) => this.saveError.set(err.message),
    });
  }

  onSubmit(): void {
    if (this.eventForm.invalid) return;

    const { title, date, location, description } = this.eventForm.getRawValue();
    const newEvent: CreateEventDto = { title, date, location, description };

    this.saving.set(true);
    this.saveError.set(null);
    this.eventForm.disable();

    const id = this.id();
    const request = id
      ? this.eventService.updateEvent(id, newEvent)
      : this.eventService.addEvent(newEvent);

    request.subscribe({
      next: (response) => {
        this.snackBar.open(`${newEvent.title} saved`, 'Close', { duration: 10000 });
        console.log('Event saved successfully:', response);
        this.router.navigate(['/events']);
      },
      error: (err: Error) => {
        this.saveError.set(err.message);
        this.saving.set(false);
        this.eventForm.enable();
      },
    });
  }
}