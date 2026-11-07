export interface Guest {
  _id?: string;
  name: string;
  email: string;
  rsvp?: 'yes' | 'no' | 'pending';
  event?: string;
}