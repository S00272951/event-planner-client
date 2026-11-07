// called PlannerEvent because "Event" is already a built-in type in the browser
export interface PlannerEvent {
  _id?: string;
  title: string;
  date: string;
  location: string;
  description?: string;
}