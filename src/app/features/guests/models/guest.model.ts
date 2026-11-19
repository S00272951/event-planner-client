export type RsvpStatus = 'yes' | 'no' | 'pending';

export interface Guest {
  _id: string;
  name: string;
  email: string;
  rsvp: RsvpStatus;
  event: string;
}

export interface CreateGuestDto {
  name: string;
  email: string;
  rsvp: RsvpStatus;
}

export interface UpdateGuestDto {
  name: string;
  email: string;
  rsvp: RsvpStatus;
}