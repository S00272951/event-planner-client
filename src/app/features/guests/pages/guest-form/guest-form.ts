import { Component, OnInit, inject, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CreateGuestDto, RsvpStatus } from '../../models/guest.model';
import { GuestService } from '../../services/guest.service';
import { notBlank } from '../../../../shared/validators/not-blank.validator';

@Component({
  selector: 'app-guest-form',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressBarModule
  ],
  templateUrl: './guest-form.html',
  styleUrl: './guest-form.scss',
})
export class GuestForm implements OnInit {
  private formBuilder = inject(FormBuilder);
  private guestService = inject(GuestService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  // both come from the url
  readonly eventId = input.required<string>();
  readonly guestId = input<string>();  // only has a value when editing

  saving = signal(false);
  saveError = signal<string | null>(null);

  guestForm = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(100), notBlank]],
    email: ['', [Validators.required, Validators.email]],
    rsvp: ['pending' as RsvpStatus],
  });

  ngOnInit(): void {
    const guestId = this.guestId();
    if (!guestId) return; // adding a new guest, nothing to load

    this.guestService.getGuestById(guestId).subscribe({
      next: (guest) =>
        this.guestForm.patchValue({ name: guest.name, email: guest.email, rsvp: guest.rsvp }),
      error: (err: Error) => this.saveError.set(err.message),
    });
  }

  onSubmit(): void {
    if (this.guestForm.invalid) return;

    const { name, email, rsvp } = this.guestForm.getRawValue();
    const guest: CreateGuestDto = { name: name.trim(), email: email.trim(), rsvp };

    this.saving.set(true);
    this.saveError.set(null);
    this.guestForm.disable();

    const guestId = this.guestId();
    const request = guestId
      ? this.guestService.updateGuest(guestId, guest)
      : this.guestService.addGuest(this.eventId(), guest);

    request.subscribe({
      next: () => {
        this.snackBar.open(`${guest.name} saved`, 'Close', { duration: 5000 });
        this.router.navigate(['/events', this.eventId()]);
      },
      error: (err: Error) => {
        this.saveError.set(err.message);
        this.saving.set(false);
        this.guestForm.enable();
      },
    });
  }
}